import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    // Get all licenses
    const licensesSnapshot = await adminDb.collection('licenses').limit(10).get();
    
    const licenses = [];
    licensesSnapshot.forEach(doc => {
      licenses.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Get all restaurants
    const restaurantsSnapshot = await adminDb.collection('restaurants').limit(10).get();
    
    const restaurants = [];
    restaurantsSnapshot.forEach(doc => {
      restaurants.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return NextResponse.json({
      success: true,
      licensesCount: licenses.length,
      licenses,
      restaurantsCount: restaurants.length,
      restaurants
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
