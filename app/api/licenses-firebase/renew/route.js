import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Calculate new expiry date
function calculateNewExpiryDate(currentExpiry, planType) {
  const date = new Date(currentExpiry);
  const durations = {
    'monthly': 1,
    'semi_annual': 6,
    'annual': 12
  };
  date.setMonth(date.getMonth() + durations[planType]);
  return date.toISOString();
}

export async function POST(request) {
  try {
    const { license_key, plan_type, payment_method } = await request.json();

    if (!license_key || !plan_type) {
      return NextResponse.json(
        { error: 'License key and plan type are required' },
        { status: 400 }
      );
    }

    // Get license document
    const licenseDoc = await adminDb.collection('licenses').doc(license_key).get();

    if (!licenseDoc.exists) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 }
      );
    }

    const license = licenseDoc.data();
    
    // Calculate new expiry date
    const currentExpiry = license.expiry_date;
    const newExpiryDate = calculateNewExpiryDate(currentExpiry, plan_type);

    // Update license
    await adminDb.collection('licenses').doc(license_key).update({
      expiry_date: newExpiryDate,
      plan_type: plan_type,
      status: 'active',
      updated_at: new Date().toISOString()
    });

    // Create payment record
    const planPrices = {
      'monthly': 999,
      'semi_annual': 4999,
      'annual': 8999
    };

    await adminDb.collection('payments').add({
      restaurant_id: license.restaurant_id,
      license_key: license_key,
      amount: planPrices[plan_type],
      plan_type,
      payment_date: new Date().toISOString(),
      payment_method: payment_method || 'manual',
      status: 'completed',
      created_at: new Date().toISOString()
    });

    // Get updated license
    const updatedLicenseDoc = await adminDb.collection('licenses').doc(license_key).get();
    const updatedLicense = updatedLicenseDoc.data();

    // Get restaurant info
    const restaurantDoc = await adminDb.collection('restaurants').doc(license.restaurant_id).get();
    const restaurant = restaurantDoc.data();

    return NextResponse.json({
      success: true,
      message: 'License renewed successfully',
      license: updatedLicense,
      restaurant: {
        id: license.restaurant_id,
        name: restaurant?.name
      },
      payment: {
        amount: planPrices[plan_type],
        plan_type
      }
    });
  } catch (error) {
    console.error('Error renewing license:', error);
    return NextResponse.json(
      { error: 'Failed to renew license', details: error.message },
      { status: 500 }
    );
  }
}
