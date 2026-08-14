import { NextResponse } from 'next/server';
import db, { generateLicenseKey, calculateExpiryDate } from '@/lib/db';

export async function POST(request) {
  try {
    const { restaurant_id, plan_type, plan_duration, amount, payment_method } = await request.json();

    if (!restaurant_id || !plan_type || !plan_duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if restaurant exists
    const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ?').get(restaurant_id);
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Deactivate old licenses
    db.prepare('UPDATE licenses SET status = "inactive" WHERE restaurant_id = ? AND status = "active"').run(restaurant_id);

    // Generate new license
    const licenseKey = generateLicenseKey(restaurant_id);
    const startDate = new Date().toISOString().split('T')[0];
    const expiryDate = calculateExpiryDate(startDate, plan_duration);

    const insertLicense = db.prepare(`
      INSERT INTO licenses (restaurant_id, license_key, plan_type, plan_duration, start_date, expiry_date, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `);

    const licenseResult = insertLicense.run(
      restaurant_id,
      licenseKey,
      plan_type,
      plan_duration,
      startDate,
      expiryDate
    );

    // Record payment
    const insertPayment = db.prepare(`
      INSERT INTO payments (restaurant_id, license_id, amount, plan_type, plan_duration, payment_method, payment_status, payment_date)
      VALUES (?, ?, ?, ?, ?, ?, 'completed', datetime('now'))
    `);

    insertPayment.run(
      restaurant_id,
      licenseResult.lastInsertRowid,
      amount,
      plan_type,
      plan_duration,
      payment_method || 'manual'
    );

    return NextResponse.json({
      success: true,
      license: {
        license_key: licenseKey,
        expiry_date: expiryDate,
        plan_type,
        plan_duration
      }
    });
  } catch (error) {
    console.error('Renew license error:', error);
    return NextResponse.json(
      { error: 'Failed to renew license' },
      { status: 500 }
    );
  }
}
