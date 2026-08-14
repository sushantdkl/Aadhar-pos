import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    // Get all licenses
    const licensesSnapshot = await adminDb.collection('licenses').get();
    const licenses = licensesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ licenses });
  } catch (error) {
    console.error('Error fetching licenses:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    // Validate required fields
    if (!data.license_key || !data.business_id || !data.business_type || !data.expiry_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create license document
    const licenseRef = adminDb.collection('licenses').doc(data.license_key);
    const licenseData = {
      license_key: data.license_key,
      business_id: data.business_id,
      business_type: data.business_type,
      restaurant_id: data.business_id, // For backward compatibility
      plan_type: data.plan_type || 'monthly',
      plan_duration: data.plan_duration || 1,
      start_date: data.start_date || new Date().toISOString().split('T')[0],
      expiry_date: data.expiry_date,
      grace_period_days: data.grace_period_days || 5,
      status: data.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await licenseRef.set(licenseData);

    return NextResponse.json({
      success: true,
      license: {
        id: licenseRef.id,
        ...licenseData
      }
    });
  } catch (error) {
    console.error('Error creating license:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
