import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shop_id');
    const licenseId = searchParams.get('license_id');

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    let paymentsQuery = adminDb.collection('payments');

    // Filter by shop_id if provided
    if (shopId) {
      paymentsQuery = paymentsQuery.where('shop_id', '==', shopId);
    }

    // Filter by license_id if provided
    if (licenseId) {
      paymentsQuery = paymentsQuery.where('license_id', '==', licenseId);
    }

    // Order by payment date descending
    paymentsQuery = paymentsQuery.orderBy('payment_date', 'desc');

    const paymentsSnapshot = await paymentsQuery.get();

    const payments = paymentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      payments,
      total: payments.length
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const paymentData = await request.json();

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    // Validate required fields
    if (!paymentData.shop_id || !paymentData.license_id || !paymentData.amount) {
      return NextResponse.json(
        { error: 'Missing required fields: shop_id, license_id, amount' },
        { status: 400 }
      );
    }

    // Create payment record
    const paymentRef = await adminDb.collection('payments').add({
      ...paymentData,
      payment_status: paymentData.payment_status || 'completed',
      payment_date: paymentData.payment_date || new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    const paymentDoc = await paymentRef.get();

    return NextResponse.json({
      success: true,
      payment: {
        id: paymentRef.id,
        ...paymentDoc.data()
      }
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
