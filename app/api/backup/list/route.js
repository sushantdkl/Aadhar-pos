import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const licenseKey = searchParams.get('license_key');

    if (!licenseKey) {
      return NextResponse.json(
        { error: 'License key is required' },
        { status: 400 }
      );
    }

    // Get all backups for this license
    const backupsSnapshot = await adminDb
      .collection('backups')
      .where('license_key', '==', licenseKey)
      .get();

    if (backupsSnapshot.empty) {
      return NextResponse.json({
        success: true,
        backups: [],
        message: 'No backups found for this license'
      });
    }

    const backups = [];
    backupsSnapshot.forEach(doc => {
      const data = doc.data();
      backups.push({
        backup_id: data.backup_id || doc.id,
        license_key: data.license_key,
        shop_name: data.shop_name,
        backup_date: data.backup_date,
        uploaded_at: data.uploaded_at,
        size_kb: data.size_kb,
        stats: data.stats
      });
    });
    
    // Sort in memory instead of using Firestore orderBy
    backups.sort((a, b) => new Date(b.backup_date) - new Date(a.backup_date));
    
    // Limit to last 10
    const limitedBackups = backups.slice(0, 10);

    return NextResponse.json({
      success: true,
      backups: limitedBackups,
      total: limitedBackups.length
    });

  } catch (error) {
    console.error('Fetch backups error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backups', details: error.message },
      { status: 500 }
    );
  }
}
