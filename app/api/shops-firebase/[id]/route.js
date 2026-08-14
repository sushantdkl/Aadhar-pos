import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    const shopDoc = await adminDb.collection('shops').doc(id).get();

    if (!shopDoc.exists) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Get licenses for this shop
    const licensesSnapshot = await adminDb
      .collection('licenses')
      .where('business_id', '==', id)
      .where('business_type', '==', 'retail')
      .get();

    const licenses = licensesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      shop: {
        id: shopDoc.id,
        ...shopDoc.data()
      },
      licenses
    });
  } catch (error) {
    console.error('Error fetching shop:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    const shopRef = adminDb.collection('shops').doc(id);
    const shopDoc = await shopRef.get();

    if (!shopDoc.exists) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    await shopRef.update({
      ...updates,
      updated_at: new Date().toISOString()
    });

    const updatedDoc = await shopRef.get();

    return NextResponse.json({
      success: true,
      shop: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    });
  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    // Check if shop has active licenses
    const licensesSnapshot = await adminDb
      .collection('licenses')
      .where('business_id', '==', id)
      .where('business_type', '==', 'retail')
      .get();

    if (!licensesSnapshot.empty) {
      return NextResponse.json(
        { error: 'Cannot delete shop with active licenses' },
        { status: 400 }
      );
    }

    await adminDb.collection('shops').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
