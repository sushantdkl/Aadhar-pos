import { NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebase-admin';
import JSZip from 'jszip';

export async function POST(request) {
  try {
    const licenseKey = request.headers.get('X-License-Key');
    
    if (!licenseKey) {
      return NextResponse.json(
        { error: 'License key is required' },
        { status: 400 }
      );
    }

    const receivedData = await request.json();
    
    if (!receivedData.zip_data || !receivedData.backup_date) {
      return NextResponse.json(
        { error: 'Invalid backup data format' },
        { status: 400 }
      );
    }

    // Verify license exists
    const licenseDoc = await adminDb.collection('licenses').doc(licenseKey).get();
    
    if (!licenseDoc.exists) {
      return NextResponse.json(
        { error: 'Invalid license key' },
        { status: 404 }
      );
    }

    const licenseData = licenseDoc.data();
    const timestamp = Date.now();
    const backupId = `backup_${timestamp}`;
    const fileName = `backups/${licenseKey}/${backupId}.zip`;
    
    console.log('📤 Uploading ZIP to Firebase Storage:', fileName);
    
    // Try Firebase Storage first, fallback to Firestore if not available
    let storageMethod = 'firestore'; // Default to Firestore
    const bucket = adminStorage.bucket();
    
    try {
      const file = bucket.file(fileName);
      const zipBuffer = Buffer.from(receivedData.zip_data, 'base64');
      
      await file.save(zipBuffer, {
        metadata: {
          contentType: 'application/zip',
          metadata: {
            license_key: licenseKey,
            shop_name: receivedData.shop_name || 'Unknown',
            backup_date: receivedData.backup_date
          }
        }
      });
      
      storageMethod = 'storage';
      console.log('✅ ZIP uploaded to Firebase Storage');
    } catch (storageError) {
      console.warn('⚠️  Firebase Storage not available, using Firestore fallback');
      console.warn('   Error:', storageError.message);
      
      // Fallback: Store ZIP data in Firestore (split into chunks if needed)
      const chunkSize = 900000; // ~900KB per chunk (Firestore limit is 1MB per doc)
      const zipData = receivedData.zip_data;
      const chunks = Math.ceil(zipData.length / chunkSize);
      
      console.log(`📦 Storing ZIP in Firestore (${chunks} chunk${chunks > 1 ? 's' : ''})...`);
      
      for (let i = 0; i < chunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, zipData.length);
        const chunkData = zipData.slice(start, end);
        
        await adminDb.collection('backup_files').doc(`${backupId}_chunk_${i}`).set({
          backup_id: backupId,
          chunk_index: i,
          total_chunks: chunks,
          data: chunkData,
          created_at: new Date().toISOString()
        });
      }
      
      console.log('✅ ZIP stored in Firestore');
    }
    
    // Store only metadata in Firestore
    const backupMetadata = {
      backup_id: backupId,
      license_key: licenseKey,
      shop_name: receivedData.shop_name || licenseData.shop_name || 'Unknown',
      backup_date: receivedData.backup_date,
      uploaded_at: new Date().toISOString(),
      storage_path: fileName,
      storage_method: storageMethod,
      size_kb: receivedData.size_kb || 0,
      stats: receivedData.stats || {}
    };
    
    // Store metadata in Firestore under backups collection
    await adminDb.collection('backups').doc(backupId).set(backupMetadata);
    
    console.log('✅ Backup metadata saved to Firestore');
    
    // Extract and save products to master database
    console.log('📊 Extracting products for master database...');
    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(Buffer.from(receivedData.zip_data, 'base64'));
      const backupFile = zipContent.file('backup.json');
      
      if (backupFile) {
        const backupJson = await backupFile.async('string');
        const backup = JSON.parse(backupJson);
        
        if (backup.data && backup.data.products) {
          const products = backup.data.products;
          console.log(`   Found ${products.length} products`);
          
          // Save each product to master_products collection
          const batch = adminDb.batch();
          let updateCount = 0;
          
          for (const product of products) {
            if (product.barcode) { // Only products with barcodes
              const productId = `${licenseKey}_${product.barcode}`;
              const productRef = adminDb.collection('master_products').doc(productId);
              
              batch.set(productRef, {
                barcode: product.barcode,
                name: product.name || 'Unknown',
                price: product.price || 0,
                cost: product.cost || 0,
                category: product.category || 'Uncategorized',
                license_key: licenseKey,
                shop_name: receivedData.shop_name || licenseData.shop_name || 'Unknown',
                last_updated: new Date().toISOString()
              }, { merge: true });
              
              updateCount++;
            }
          }
          
          if (updateCount > 0) {
            await batch.commit();
            console.log(`   ✅ Saved ${updateCount} products to master database`);
          }
        }
      }
    } catch (productError) {
      console.error('   ⚠️ Failed to extract products (non-critical):', productError.message);
    }
    
    // Clean up old backups - keep only last 5
    console.log('🧹 Cleaning up old backups...');
    try {
      const allBackupsSnapshot = await adminDb
        .collection('backups')
        .where('license_key', '==', licenseKey)
        .get();
      
      const allBackups = [];
      allBackupsSnapshot.forEach(doc => {
        const data = doc.data();
        allBackups.push({
          id: doc.id,
          backup_id: data.backup_id,
          uploaded_at: data.uploaded_at,
          storage_path: data.storage_path
        });
      });
      
      // Sort by uploaded date (newest first)
      allBackups.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
      
      // Keep only last 5, delete the rest
      const backupsToDelete = allBackups.slice(5);
      
      if (backupsToDelete.length > 0) {
        console.log(`🗑️  Deleting ${backupsToDelete.length} old backup(s)...`);
        
        for (const backup of backupsToDelete) {
          // Delete from Firebase Storage
          try {
            const fileToDelete = bucket.file(backup.storage_path);
            await fileToDelete.delete();
            console.log(`  ✓ Deleted ZIP: ${backup.storage_path}`);
          } catch (storageError) {
            console.error(`  ✗ Failed to delete ZIP: ${backup.storage_path}`, storageError.message);
          }
          
          // Delete from Firestore
          try {
            await adminDb.collection('backups').doc(backup.id).delete();
            console.log(`  ✓ Deleted metadata: ${backup.id}`);
          } catch (firestoreError) {
            console.error(`  ✗ Failed to delete metadata: ${backup.id}`, firestoreError.message);
          }
        }
        
        console.log(`✅ Cleanup complete. ${allBackups.length - backupsToDelete.length} backups remaining.`);
      } else {
        console.log('✅ No old backups to clean up.');
      }
    } catch (cleanupError) {
      console.error('⚠️  Cleanup failed (non-critical):', cleanupError.message);
      // Don't fail the upload if cleanup fails
    }
    
    return NextResponse.json({
      success: true,
      backup_id: backupId,
      message: 'Backup uploaded successfully',
      storage_path: fileName
    });
    
  } catch (error) {
    console.error('Backup upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload backup' },
      { status: 500 }
    );
  }
}
