import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get('barcode');
    const license_key = searchParams.get('license_key');
    
    if (!barcode) {
      return NextResponse.json(
        { error: 'Barcode is required' },
        { status: 400 }
      );
    }

    // Search for product by barcode
    // First check this shop's products
    if (license_key) {
      const productId = `${license_key}_${barcode}`;
      const productDoc = await adminDb.collection('master_products').doc(productId).get();
      
      if (productDoc.exists) {
        return NextResponse.json({
          found: true,
          product: {
            ...productDoc.data(),
            source: 'own'
          }
        });
      }
    }

    // Then search all products with this barcode
    const snapshot = await adminDb
      .collection('master_products')
      .where('barcode', '==', barcode)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ found: false, product: null }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    return NextResponse.json({
      found: true,
      product: {
        ...doc.data(),
        source: 'other_shop'
      }
    });

  } catch (error) {
    console.error('Master product search error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
