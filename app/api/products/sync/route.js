import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const licenseKey = request.headers.get('X-License-Key');
    
    if (!licenseKey) {
      return NextResponse.json(
        { error: 'License key is required' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { products, shop_name } = data;
    
    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Products array is required' },
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
    const finalShopName = shop_name || licenseData.shop_name || 'Unknown';

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
          stock: product.stock || 0,
          license_key: licenseKey,
          shop_name: finalShopName,
          last_updated: new Date().toISOString(),
          product_id: product.id
        }, { merge: true });
        
        updateCount++;
      }
    }

    if (updateCount > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      synced_count: updateCount,
      message: `Successfully synced ${updateCount} product(s)`
    });

  } catch (error) {
    console.error('Product sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync products' },
      { status: 500 }
    );
  }
}
