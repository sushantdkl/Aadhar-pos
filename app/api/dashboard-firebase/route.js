import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    // Get total restaurants
    const restaurantsSnapshot = await adminDb.collection('restaurants').get();
    const totalRestaurants = restaurantsSnapshot.size;

    // Get total shops
    const shopsSnapshot = await adminDb.collection('shops').get();
    const totalShops = shopsSnapshot.size;

    // Get total leads
    const leadsSnapshot = await adminDb.collection('leads').get();
    const totalLeads = leadsSnapshot.size;

    // Get total contacts
    const contactsSnapshot = await adminDb.collection('contacts').get();
    const totalContacts = contactsSnapshot.size;

    // Calculate total revenue from payments
    const paymentsSnapshot = await adminDb.collection('payments').get();
    let totalRevenue = 0;
    paymentsSnapshot.forEach(doc => {
      totalRevenue += doc.data().amount || 0;
    });

    // Get recent businesses (5 restaurants + 5 shops)
    const recentRestaurantsSnapshot = await adminDb.collection('restaurants')
      .orderBy('created_at', 'desc')
      .limit(5)
      .get();

    const recentShopsSnapshot = await adminDb.collection('shops')
      .orderBy('created_at', 'desc')
      .limit(5)
      .get();

    const recentBusinesses = [];
    
    // Process restaurants
    for (const doc of recentRestaurantsSnapshot.docs) {
      const business = { id: doc.id, ...doc.data(), type: 'restaurant' };
      
      // Get license for this restaurant
      const licenseSnapshot = await adminDb.collection('licenses')
        .where('restaurant_id', '==', doc.id)
        .limit(1)
        .get();
      
      if (!licenseSnapshot.empty) {
        const licenseData = licenseSnapshot.docs[0].data();
        business.license_key = licenseData.license_key;
        business.expiry_date = licenseData.expiry_date;
        business.license_status = licenseData.status;
      }
      
      recentBusinesses.push(business);
    }

    // Process shops
    for (const doc of recentShopsSnapshot.docs) {
      const business = { id: doc.id, ...doc.data(), type: 'retail' };
      
      // Get license for this shop
      const licenseSnapshot = await adminDb.collection('licenses')
        .where('business_id', '==', doc.id)
        .limit(1)
        .get();
      
      if (!licenseSnapshot.empty) {
        const licenseData = licenseSnapshot.docs[0].data();
        business.license_key = licenseData.license_key;
        business.expiry_date = licenseData.expiry_date;
        business.license_status = licenseData.status;
      }
      
      recentBusinesses.push(business);
    }

    // Sort by created_at
    recentBusinesses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json({
      stats: {
        totalRestaurants,
        totalShops,
        totalLeads,
        totalContacts,
        totalRevenue
      },
      recentBusinesses: recentBusinesses.slice(0, 10)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', details: error.message },
      { status: 500 }
    );
  }
}
