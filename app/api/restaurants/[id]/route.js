import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { calculateExpiryDate } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const restaurant = db.prepare(`
      SELECT r.*, 
        l.id as license_id,
        l.license_key, 
        l.expiry_date, 
        l.status as license_status,
        l.plan_type,
        l.plan_duration,
        l.grace_period_days,
        l.start_date,
        l.last_verified,
        l.cloud_backup_enabled
      FROM restaurants r
      LEFT JOIN licenses l ON r.id = l.restaurant_id AND l.status = 'active'
      WHERE r.id = ?
    `).get(id);

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Get payment history
    const payments = db.prepare(`
      SELECT * FROM payments 
      WHERE restaurant_id = ?
      ORDER BY created_at DESC
    `).all(id);

    return NextResponse.json({ restaurant, payments });
  } catch (error) {
    console.error('Get restaurant error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (data.action === 'extend_expiry') {
      const { additional_days } = data;
      
      const license = db.prepare(`
        SELECT * FROM licenses 
        WHERE restaurant_id = ? AND status = 'active'
      `).get(id);

      if (!license) {
        return NextResponse.json(
          { error: 'No active license found' },
          { status: 404 }
        );
      }

      const currentExpiry = new Date(license.expiry_date);
      const newExpiry = new Date(currentExpiry);
      newExpiry.setDate(newExpiry.getDate() + parseInt(additional_days));

      db.prepare(`
        UPDATE licenses 
        SET expiry_date = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(newExpiry.toISOString().split('T')[0], license.id);

      return NextResponse.json({
        success: true,
        message: `Expiry extended by ${additional_days} days`,
        new_expiry: newExpiry.toISOString().split('T')[0]
      });
    }

    if (data.action === 'extend_grace') {
      const { grace_days } = data;
      
      db.prepare(`
        UPDATE licenses 
        SET grace_period_days = ?, updated_at = datetime('now')
        WHERE restaurant_id = ? AND status = 'active'
      `).run(grace_days, id);

      return NextResponse.json({
        success: true,
        message: `Grace period updated to ${grace_days} days`
      });
    }

    if (data.action === 'suspend') {
      db.prepare(`
        UPDATE restaurants 
        SET status = 'suspended', updated_at = datetime('now')
        WHERE id = ?
      `).run(id);

      db.prepare(`
        UPDATE licenses 
        SET status = 'suspended', updated_at = datetime('now')
        WHERE restaurant_id = ?
      `).run(id);

      return NextResponse.json({
        success: true,
        message: 'Restaurant suspended'
      });
    }

    if (data.action === 'activate') {
      db.prepare(`
        UPDATE restaurants 
        SET status = 'active', updated_at = datetime('now')
        WHERE id = ?
      `).run(id);

      db.prepare(`
        UPDATE licenses 
        SET status = 'active', updated_at = datetime('now')
        WHERE restaurant_id = ?
      `).run(id);

      return NextResponse.json({
        success: true,
        message: 'Restaurant activated'
      });
    }

    // Cloud Backup Toggle
    if (data.cloud_backup_enabled !== undefined) {
      const cloudBackupEnabled = data.cloud_backup_enabled ? 1 : 0;
      
      db.prepare(`
        UPDATE licenses 
        SET cloud_backup_enabled = ?, updated_at = datetime('now')
        WHERE restaurant_id = ? AND status = 'active'
      `).run(cloudBackupEnabled, id);

      return NextResponse.json({
        success: true,
        message: `Cloud backup ${cloudBackupEnabled ? 'enabled' : 'disabled'}`,
        cloud_backup_enabled: Boolean(cloudBackupEnabled)
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update restaurant error:', error);
    return NextResponse.json(
      { error: 'Failed to update restaurant' },
      { status: 500 }
    );
  }
}
