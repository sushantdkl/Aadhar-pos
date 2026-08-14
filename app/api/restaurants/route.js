import { NextResponse } from 'next/server';
import db, { generateLicenseKey, calculateExpiryDate } from '@/lib/db';

export async function GET() {
  try {
    const restaurants = db.prepare(`
      SELECT r.*, 
        l.license_key, 
        l.expiry_date, 
        l.status as license_status,
        l.plan_type,
        l.id as license_id
      FROM restaurants r
      LEFT JOIN licenses l ON r.id = l.restaurant_id AND l.status = 'active'
      ORDER BY r.created_at DESC
    `).all();

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error('Get restaurants error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      name,
      owner_name,
      phone,
      email,
      address,
      city,
      state,
      pan_number,
      gst_number,
      plan_type,
      plan_duration,
      amount
    } = data;

    if (!name || !owner_name || !phone || !plan_type || !plan_duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Start transaction
    const insertRestaurant = db.prepare(`
      INSERT INTO restaurants (name, owner_name, phone, email, address, city, state, pan_number, gst_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertRestaurant.run(
      name,
      owner_name,
      phone,
      email || null,
      address || null,
      city || null,
      state || null,
      pan_number || null,
      gst_number || null
    );

    const restaurantId = result.lastInsertRowid;

    // Generate license
    const licenseKey = generateLicenseKey(restaurantId);
    const startDate = new Date().toISOString().split('T')[0];
    const expiryDate = calculateExpiryDate(startDate, plan_duration);

    const insertLicense = db.prepare(`
      INSERT INTO licenses (restaurant_id, license_key, plan_type, plan_duration, start_date, expiry_date, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `);

    const licenseResult = insertLicense.run(
      restaurantId,
      licenseKey,
      plan_type,
      plan_duration,
      startDate,
      expiryDate
    );

    // Record payment
    if (amount) {
      const insertPayment = db.prepare(`
        INSERT INTO payments (restaurant_id, license_id, amount, plan_type, plan_duration, payment_status, payment_date)
        VALUES (?, ?, ?, ?, ?, 'completed', datetime('now'))
      `);

      insertPayment.run(
        restaurantId,
        licenseResult.lastInsertRowid,
        amount,
        plan_type,
        plan_duration
      );
    }

    return NextResponse.json({
      success: true,
      restaurant: {
        id: restaurantId,
        name,
        license_key: licenseKey,
        expiry_date: expiryDate
      }
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}
