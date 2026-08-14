import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const { license_key, feature } = await request.json();

    if (!license_key || !feature) {
      return NextResponse.json(
        { error: 'License key and feature are required' },
        { status: 400 }
      );
    }

    // Get license from Firebase
    const licenseDoc = await adminDb.collection('licenses').doc(license_key).get();

    if (!licenseDoc.exists) {
      return NextResponse.json(
        { error: 'License not found', enabled: false },
        { status: 404 }
      );
    }

    const licenseData = licenseDoc.data();
    
    // Check if feature is enabled
    let enabled = false;
    
    if (feature === 'cloud_backup') {
      enabled = licenseData.cloud_backup_enabled === true;
    }
    
    return NextResponse.json({
      enabled,
      feature,
      license_key,
      activated_at: licenseData.cloud_backup_activated_at || null
    });

  } catch (error) {
    console.error('Feature check error:', error);
    return NextResponse.json(
      { error: 'Failed to check feature', enabled: false },
      { status: 500 }
    );
  }
}
