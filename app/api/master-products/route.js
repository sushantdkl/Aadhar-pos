import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '100');
    
    let query = adminDb.collection('master_products');
    
    // If search provided, filter by name or barcode
    if (search) {
      // Note: Firestore doesn't support OR queries easily, so we'll filter in memory
      const snapshot = await query.limit(1000).get();
      
      const products = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const searchLower = search.toLowerCase();
        
        if (
          data.name?.toLowerCase().includes(searchLower) ||
          data.barcode?.includes(search) ||
          data.category?.toLowerCase().includes(searchLower) ||
          data.shop_name?.toLowerCase().includes(searchLower)
        ) {
          products.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      return NextResponse.json({
        success: true,
        products: products.slice(0, limit),
        total: products.length
      });
    }
    
    // No search - get all (limited)
    const snapshot = await query.limit(limit).get();
    
    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return NextResponse.json({
      success: true,
      products: products,
      total: products.length
    });
    
  } catch (error) {
    console.error('Master products error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch master products' },
      { status: 500 }
    );
  }
}
