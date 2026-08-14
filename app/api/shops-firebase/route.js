import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    // Get all shops
    const shopsSnapshot = await adminDb.collection('shops').get();
    const shops = shopsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'retail'
    }));

    return NextResponse.json({ shops });
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    // Validate required fields
    if (!data.name || !data.owner_name || !data.phone) {
      return NextResponse.json(
        { error: 'Name, owner name, and phone are required' },
        { status: 400 }
      );
    }

    // Create shop document
    const shopRef = adminDb.collection('shops').doc();
    const shopData = {
      name: data.name,
      owner_name: data.owner_name,
      phone: data.phone,
      email: data.email || '',
      address: data.address || '',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await shopRef.set(shopData);

    return NextResponse.json({
      success: true,
      shop_id: shopRef.id,
      shop: {
        id: shopRef.id,
        ...shopData
      }
    });
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('id');

    if (!shopId) {
      return NextResponse.json(
        { error: 'Shop ID is required' },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    // Get shop data before deletion
    const shopDoc = await adminDb.collection('shops').doc(shopId).get();
    if (!shopDoc.exists) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    const shopData = shopDoc.data();

    // Delete all licenses associated with this shop
    const licensesSnapshot = await adminDb.collection('licenses')
      .where('shop_id', '==', shopId)
      .get();
    
    const deletionPromises = [];
    
    licensesSnapshot.forEach(doc => {
      deletionPromises.push(doc.ref.delete());
    });

    // Delete all payments associated with this shop
    const paymentsSnapshot = await adminDb.collection('payments')
      .where('shop_id', '==', shopId)
      .get();
    
    paymentsSnapshot.forEach(doc => {
      deletionPromises.push(doc.ref.delete());
    });

    // Delete the shop document
    deletionPromises.push(adminDb.collection('shops').doc(shopId).delete());

    // Execute all deletions
    await Promise.all(deletionPromises);

    return NextResponse.json({
      success: true,
      message: 'Shop and all associated data deleted successfully',
      deleted: {
        shop: shopData.name,
        licenses: licensesSnapshot.size,
        payments: paymentsSnapshot.size
      }
    });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return NextResponse.json(
      { error: 'Failed to delete shop', details: error.message },
      { status: 500 }
    );
  }
}
