import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const { license_key } = await request.json();

    if (!license_key) {
      return NextResponse.json(
        { error: 'License key is required', valid: false },
        { status: 400 }
      );
    }

    // Check if Firebase is initialized
    if (!adminDb) {
      console.error('Firebase Admin not initialized');
      return NextResponse.json(
        { error: 'Server configuration error', valid: false },
        { status: 500 }
      );
    }

    // Get license info from Firebase
    const licenseDoc = await adminDb.collection('licenses').doc(license_key).get();

    if (!licenseDoc.exists) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid license key'
      });
    }

    const license = licenseDoc.data();

    // Determine business type (default to restaurant for backward compatibility)
    const businessType = license.business_type || 'restaurant';
    const businessId = license.business_id || license.restaurant_id;
    
    // Get business info from appropriate collection
    const businessDoc = await adminDb.collection(businessType === 'retail' ? 'shops' : 'restaurants').doc(businessId).get();
    
    if (!businessDoc.exists) {
      return NextResponse.json({
        valid: false,
        error: `${businessType === 'retail' ? 'Shop' : 'Restaurant'} not found`
      });
    }

    const business = businessDoc.data();

    // Check if business is active
    if (business.status !== 'active') {
      return NextResponse.json({
        valid: false,
        error: `${businessType === 'retail' ? 'Shop' : 'Restaurant'} account is suspended`
      });
    }

    const now = new Date();
    const expiryDate = new Date(license.expiry_date);
    const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    // Update last verified
    await adminDb.collection('licenses').doc(license_key).update({
      last_verified: new Date().toISOString()
    });

    // Log verification
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    await adminDb.collection('verification_logs').add({
      license_key,
      business_id: businessId,
      business_type: businessType,
      restaurant_id: license.restaurant_id, // Keep for backward compatibility
      verification_status: daysRemaining > 0 ? 'valid' : 'expired',
      ip_address: clientIp,
      timestamp: new Date().toISOString()
    });

    // Check expiry
    if (daysRemaining < 0) {
      // Check grace period
      const graceDays = license.grace_period_days || 7;
      const graceRemaining = graceDays + daysRemaining;

      if (graceRemaining <= 0) {
        return NextResponse.json({
          valid: false,
          status: 'expired',
          error: 'License has expired',
          expiry_date: license.expiry_date,
          days_remaining: daysRemaining,
          grace_period_days: license.grace_period_days || 5, // Always return grace period
          business_type: businessType,
          // Unified response for both types
          restaurant_name: business.name,
          restaurant_address: business.address || business.location,
          restaurant_phone: business.phone || business.contact_number,
          restaurant_email: business.email || business.contact_email,
          owner_name: business.owner_name,
          // Also include as nested object
          restaurant: {
            name: business.name,
            location: business.address || business.location,
            contact_number: business.phone || business.contact_number,
            contact_email: business.email || business.contact_email,
            owner_name: business.owner_name
          },
          // Shop-specific aliases
          shop_name: business.name,
          shop_address: business.address || business.location,
          shop_phone: business.phone || business.contact_number,
          shop_email: business.email || business.contact_email
        });
      }

      return NextResponse.json({
        valid: true,
        status: 'grace',
        message: 'License expired, in grace period',
        expiry_date: license.expiry_date,
        days_remaining: daysRemaining,
        grace_remaining: graceRemaining,
        grace_period_days: license.grace_period_days || 5,
        business_type: businessType,
        // Unified response
        restaurant_name: business.name,
        restaurant_address: business.address || business.location,
        restaurant_phone: business.phone || business.contact_number,
        restaurant_email: business.email || business.contact_email,
        owner_name: business.owner_name,
        restaurant: {
          name: business.name,
          location: business.address || business.location,
          contact_number: business.phone || business.contact_number,
          contact_email: business.email || business.contact_email,
          owner_name: business.owner_name
        },
        shop_name: business.name,
        shop_address: business.address || business.location,
        shop_phone: business.phone || business.contact_number,
        shop_email: business.email || business.contact_email,
        plan_type: license.plan_type
      });
    }

    return NextResponse.json({
      valid: true,
      status: daysRemaining <= 7 ? 'expiring_soon' : 'active',
      expiry_date: license.expiry_date,
      days_remaining: daysRemaining,
      grace_period_days: license.grace_period_days || 5,
      business_type: businessType,
      // Unified response for both types
      restaurant_name: business.name,
      restaurant_address: business.address || business.location,
      restaurant_phone: business.phone || business.contact_number,
      restaurant_email: business.email || business.contact_email,
      owner_name: business.owner_name,
      restaurant: {
        name: business.name,
        location: business.address || business.location,
        contact_number: business.phone || business.contact_number,
        contact_email: business.email || business.contact_email,
        owner_name: business.owner_name
      },
      shop_name: business.name,
      shop_address: business.address || business.location,
      shop_phone: business.phone || business.contact_number,
      shop_email: business.email || business.contact_email,
      plan_type: license.plan_type
    });
  } catch (error) {
    console.error('License verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed', valid: false, details: error.message },
      { status: 500 }
    );
  }
}
