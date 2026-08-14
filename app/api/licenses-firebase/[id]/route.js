import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    const licenseDoc = await adminDb.collection('licenses').doc(id).get();

    if (!licenseDoc.exists) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    return NextResponse.json({
      license: {
        id: licenseDoc.id,
        ...licenseDoc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching license:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    const licenseRef = adminDb.collection('licenses').doc(id);
    const licenseDoc = await licenseRef.get();

    if (!licenseDoc.exists) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    const licenseData = licenseDoc.data();
    let updates = {};

    // Handle different action types
    if (data.action === 'extend_expiry') {
      const currentExpiry = new Date(licenseData.expiry_date);
      const newExpiry = new Date(currentExpiry);
      newExpiry.setDate(newExpiry.getDate() + (data.additional_days || 0));
      updates.expiry_date = newExpiry.toISOString().split('T')[0];
    } else if (data.action === 'set_custom_expiry') {
      updates.expiry_date = data.expiry_date;
    } else if (data.action === 'extend_grace') {
      updates.grace_period_days = data.grace_days || 5;
    } else if (data.action === 'make_payment') {
      // Handle payment recording
      const { amount, days_to_add, payment_method, payment_id, notes } = data;

      // Create payment record
      const paymentRef = await adminDb.collection('payments').add({
        shop_id: licenseData.business_id,
        license_id: id,
        amount: parseFloat(amount),
        days_added: parseInt(days_to_add) || 0,
        payment_method: payment_method || 'bank_transfer',
        payment_id: payment_id || '',
        payment_status: 'completed',
        payment_date: new Date().toISOString(),
        notes: notes || '',
        created_at: new Date().toISOString()
      });

      // Extend expiry date if days_to_add > 0
      if (days_to_add && days_to_add > 0) {
        const currentExpiry = new Date(licenseData.expiry_date);
        const newExpiry = new Date(currentExpiry);
        newExpiry.setDate(newExpiry.getDate() + parseInt(days_to_add));
        updates.expiry_date = newExpiry.toISOString().split('T')[0];
      }

      // Update license with payment info
      await licenseRef.update({
        ...updates,
        updated_at: new Date().toISOString()
      });

      const updatedDoc = await licenseRef.get();

      return NextResponse.json({
        success: true,
        message: 'Payment recorded successfully',
        payment_id: paymentRef.id,
        license: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
    } else {
      // Direct update
      updates = data;
    }

    await licenseRef.update({
      ...updates,
      updated_at: new Date().toISOString()
    });

    const updatedDoc = await licenseRef.get();

    return NextResponse.json({
      success: true,
      license: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    });
  } catch (error) {
    console.error('Error updating license:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    await adminDb.collection('licenses').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting license:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
