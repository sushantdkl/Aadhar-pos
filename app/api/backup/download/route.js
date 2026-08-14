import { NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebase-admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const backup_id = searchParams.get('backup_id');
    const license_key = searchParams.get('license_key');
    
    if (!backup_id || !license_key) {
      return NextResponse.json(
        { error: 'Backup ID and License key are required' },
        { status: 400 }
      );
    }

    // Get backup metadata
    const backupDoc = await adminDb.collection('backups').doc(backup_id).get();
    
    if (!backupDoc.exists) {
      return NextResponse.json(
        { error: 'Backup not found' },
        { status: 404 }
      );
    }
    
    const backupData = backupDoc.data();
    
    // Verify license matches
    if (backupData.license_key !== license_key) {
      return NextResponse.json(
        { error: 'Unauthorized access to backup' },
        { status: 403 }
      );
    }
    
    // Check storage method
    if (backupData.storage_method === 'firestore') {
      // Download from Firestore chunks
      console.log('📥 Downloading backup from Firestore...');
      
      const chunksSnapshot = await adminDb
        .collection('backup_files')
        .where('backup_id', '==', backup_id)
        .orderBy('chunk_index', 'asc')
        .get();
      
      if (chunksSnapshot.empty) {
        return NextResponse.json(
          { error: 'Backup chunks not found' },
          { status: 404 }
        );
      }
      
      // Combine chunks
      let zipData = '';
      chunksSnapshot.forEach(doc => {
        zipData += doc.data().data;
      });
      
      return NextResponse.json({
        success: true,
        zip_data: zipData,
        storage_method: 'firestore',
        backup_id: backup_id,
        backup_date: backupData.backup_date,
        size_kb: backupData.size_kb
      });
    } else {
      // Download from Firebase Storage
      const bucket = adminStorage.bucket();
      const file = bucket.file(backupData.storage_path);
      
      const [exists] = await file.exists();
      if (!exists) {
        return NextResponse.json(
          { error: 'Backup file not found in storage' },
          { status: 404 }
        );
      }
      
      // Get download URL (signed URL valid for 1 hour)
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000  // 1 hour
      });
      
      return NextResponse.json({
        success: true,
        download_url: url,
        storage_method: 'storage',
        backup_id: backup_id,
        backup_date: backupData.backup_date,
        size_kb: backupData.size_kb
      });
    }
    
  } catch (error) {
    console.error('Download backup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to download backup' },
      { status: 500 }
    );
  }
}
