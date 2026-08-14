import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Generate license key
function generateLicenseKey(restaurantId) {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `POS-${year}-${restaurantId}-${random}`;
}

// Calculate expiry date
function calculateExpiryDate(startDate, planType) {
  const date = new Date(startDate);
  const durations = {
    'monthly': 1,
    'semi_annual': 6,
    'annual': 12
  };
  date.setMonth(date.getMonth() + durations[planType]);
  return date.toISOString();
}

export async function GET(request) {
  try {
    // Get all restaurants
    const snapshot = await adminDb.collection('restaurants').orderBy('created_at', 'desc').get();
    
    const restaurants = [];
    for (const doc of snapshot.docs) {
      const restaurant = { id: doc.id, ...doc.data() };
      
      // Get license for this restaurant
      const licenseSnapshot = await adminDb.collection('licenses')
        .where('restaurant_id', '==', doc.id)
        .limit(1)
        .get();
      
      if (!licenseSnapshot.empty) {
        const licenseData = licenseSnapshot.docs[0].data();
        restaurant.license_key = licenseData.license_key;
        restaurant.expiry_date = licenseData.expiry_date;
        restaurant.license_status = licenseData.status;
        restaurant.plan_type = licenseData.plan_type;
        restaurant.start_date = licenseData.start_date;
        restaurant.cloud_backup_enabled = licenseData.cloud_backup_enabled || false;
        restaurant.license = {
          license_key: licenseData.license_key,
          plan_type: licenseData.plan_type,
          expiry_date: licenseData.expiry_date,
          status: licenseData.status
        };
      }
      
      restaurants.push(restaurant);
    }

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('id');

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    // Get restaurant data before deletion
    const restaurantDoc = await adminDb.collection('restaurants').doc(restaurantId).get();
    if (!restaurantDoc.exists) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const restaurantData = restaurantDoc.data();

    // Delete all licenses associated with this restaurant
    const licensesSnapshot = await adminDb.collection('licenses')
      .where('restaurant_id', '==', restaurantId)
      .get();
    
    const deletionPromises = [];
    
    licensesSnapshot.forEach(doc => {
      deletionPromises.push(doc.ref.delete());
    });

    // Delete all payments associated with this restaurant
    const paymentsSnapshot = await adminDb.collection('payments')
      .where('restaurant_id', '==', restaurantId)
      .get();
    
    paymentsSnapshot.forEach(doc => {
      deletionPromises.push(doc.ref.delete());
    });

    // Delete all shops associated with this restaurant (if exists)
    const shopsSnapshot = await adminDb.collection('shops')
      .where('restaurant_id', '==', restaurantId)
      .get();
    
    shopsSnapshot.forEach(doc => {
      deletionPromises.push(doc.ref.delete());
    });

    // Delete the restaurant document
    deletionPromises.push(adminDb.collection('restaurants').doc(restaurantId).delete());

    // Execute all deletions
    await Promise.all(deletionPromises);

    return NextResponse.json({
      success: true,
      message: 'Restaurant and all associated data deleted successfully',
      deleted: {
        restaurant: restaurantData.name,
        licenses: licensesSnapshot.size,
        payments: paymentsSnapshot.size,
        shops: shopsSnapshot.size
      }
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to delete restaurant', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, 
      location, 
      contact_number, 
      contact_email, 
      owner_name, 
      plan_type,
      license_key: providedLicenseKey,
      expiry_date: providedExpiryDate,
      grace_period_days: providedGraceDays,
      status: providedStatus,
      license_status: providedLicenseStatus
    } = body;

    // Validate required fields
    if (!name || !location || !contact_number || !plan_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create restaurant document
    const restaurantRef = adminDb.collection('restaurants').doc();
    const restaurantId = restaurantRef.id;

    const restaurant = {
      name,
      location,
      contact_number,
      contact_email: contact_email || '',
      owner_name: owner_name || '',
      status: providedStatus || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await restaurantRef.set(restaurant);

    // Use provided license key or generate new one
    const licenseKey = providedLicenseKey || generateLicenseKey(restaurantId.substring(0, 8));
    const startDate = new Date().toISOString();
    const expiryDate = providedExpiryDate || calculateExpiryDate(startDate, plan_type);

    const planPrices = {
      'monthly': 999,
      'semi_annual': 4999,
      'annual': 8999
    };

    const license = {
      restaurant_id: restaurantId,
      license_key: licenseKey,
      plan_type,
      start_date: startDate,
      expiry_date: expiryDate,
      status: providedLicenseStatus || 'active',
      grace_period_days: providedGraceDays || 5,
      last_verified: null,
      created_at: new Date().toISOString()
    };

    await adminDb.collection('licenses').doc(licenseKey).set(license);

    // Create initial payment record
    await adminDb.collection('payments').add({
      restaurant_id: restaurantId,
      license_key: licenseKey,
      amount: planPrices[plan_type],
      plan_type,
      payment_date: startDate,
      payment_method: 'initial',
      status: 'completed',
      created_at: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      restaurant_id: restaurantId,
      restaurant: { id: restaurantId, ...restaurant },
      license
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to create restaurant', details: error.message },
      { status: 500 }
    );
  }
}
