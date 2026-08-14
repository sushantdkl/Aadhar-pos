import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const backupId = searchParams.get('backup_id');

    if (!backupId) {
      return NextResponse.json(
        { error: 'Backup ID is required' },
        { status: 400 }
      );
    }

    // Get backup from Firestore
    const backupDoc = await adminDb.collection('backups').doc(backupId).get();

    if (!backupDoc.exists) {
      return NextResponse.json(
        { error: 'Backup not found' },
        { status: 404 }
      );
    }

    const backupData = backupDoc.data();

    return NextResponse.json({
      success: true,
      backup: {
        id: backupDoc.id,
        license_key: backupData.license_key,
        shop_name: backupData.shop_name,
        backup_date: backupData.backup_date,
        uploaded_at: backupData.uploaded_at,
        size_kb: backupData.size_kb,
        compact_size_kb: backupData.compact_size_kb,
        stats: backupData.stats,
        data_summary: backupData.data_summary,
        data: backupData.data || null
      }
    });

  } catch (error) {
    console.error('Fetch backup details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backup details', details: error.message },
      { status: 500 }
    );
  }
}
