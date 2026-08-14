import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Get restaurant
    const restaurantDoc = await adminDb.collection('restaurants').doc(id).get();
    
    if (!restaurantDoc.exists) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const restaurant = { id: restaurantDoc.id, ...restaurantDoc.data() };

    // Get license
    const licenseSnapshot = await adminDb.collection('licenses')
      .where('restaurant_id', '==', id)
      .limit(1)
      .get();

    if (!licenseSnapshot.empty) {
      const licenseData = licenseSnapshot.docs[0].data();
      restaurant.license_id = licenseSnapshot.docs[0].id;
      restaurant.license_key = licenseData.license_key;
      restaurant.expiry_date = licenseData.expiry_date;
      restaurant.license_status = licenseData.status;
      restaurant.plan_type = licenseData.plan_type;
      restaurant.start_date = licenseData.start_date;
      restaurant.grace_period_days = licenseData.grace_period_days || 5;
      restaurant.cloud_backup_enabled = licenseData.cloud_backup_enabled || false;
    }

    // Get payment history (sort in memory to avoid needing composite index)
    const paymentsSnapshot = await adminDb.collection('payments')
      .where('restaurant_id', '==', id)
      .get();

    const payments = paymentsSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json({ restaurant, payments });
  } catch (error) {
    console.error('Get restaurant error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (data.action === 'extend_expiry') {
      const { additional_days } = data;
      
      // Get active license
      const licenseSnapshot = await adminDb.collection('licenses')
        .where('restaurant_id', '==', id)
        .where('status', '==', 'active')
        .limit(1)
        .get();

      if (licenseSnapshot.empty) {
        return NextResponse.json(
          { error: 'No active license found' },
          { status: 404 }
        );
      }

      const licenseDoc = licenseSnapshot.docs[0];
      const licenseData = licenseDoc.data();
      
      const currentExpiry = new Date(licenseData.expiry_date);
      const newExpiry = new Date(currentExpiry);
      newExpiry.setDate(newExpiry.getDate() + parseInt(additional_days));

      await licenseDoc.ref.update({
        expiry_date: newExpiry.toISOString(),
        updated_at: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: `Expiry extended by ${additional_days} days`,
        new_expiry: newExpiry.toISOString()
      });
    }

    if (data.action === 'extend_grace') {
      const { grace_days } = data;
      
      const licenseSnapshot = await adminDb.collection('licenses')
        .where('restaurant_id', '==', id)
        .limit(1)
        .get();

      if (licenseSnapshot.empty) {
        return NextResponse.json(
          { error: 'No license found' },
          { status: 404 }
        );
      }

      await licenseSnapshot.docs[0].ref.update({
        grace_period_days: parseInt(grace_days),
        updated_at: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: `Grace period updated to ${grace_days} days`
      });
    }

    if (data.action === 'set_custom_expiry') {
      const { expiry_date } = data;
      
      const licenseSnapshot = await adminDb.collection('licenses')
        .where('restaurant_id', '==', id)
        .limit(1)
        .get();

      if (licenseSnapshot.empty) {
        return NextResponse.json(
          { error: 'No license found' },
          { status: 404 }
        );
      }

      const newExpiry = new Date(expiry_date);
      newExpiry.setHours(23, 59, 59, 999); // Set to end of day

      await licenseSnapshot.docs[0].ref.update({
        expiry_date: newExpiry.toISOString(),
        updated_at: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: 'Expiry date updated successfully',
        new_expiry: newExpiry.toISOString()
      });
    }

    if (data.action === 'suspend') {
      // Update restaurant
      await adminDb.collection('restaurants').doc(id).update({
        status: 'suspended',
        updated_at: new Date().toISOString()
      });

      // Update all licenses
      const licenseSnapshot = await adminDb.collection('licenses')
        .where('restaurant_id', '==', id)
        .get();

      const batch = adminDb.batch();
      licenseSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          status: 'suspended',
          updated_at: new Date().toISOString()
        });
      });
      await batch.commit();

      return NextResponse.json({
        success: true,
        message: 'Restaurant suspended'
      });
    }

    if (data.action === 'activate') {
      // Update restaurant
      await adminDb.collection('restaurants').doc(id).update({
        status: 'active',
        updated_at: new Date().toISOString()
      });

      // Update all licenses
      const licenseSnapshot = await adminDb.collection('licenses')
        .where('restaurant_id', '==', id)
        .get();

      const batch = adminDb.batch();
      licenseSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          status: 'active',
          updated_at: new Date().toISOString()
        });
      });
      await batch.commit();

      return NextResponse.json({
        success: true,
        message: 'Restaurant activated'
      });
    }

    if (data.action === 'toggle_cloud_backup') {
      const { cloud_backup_enabled } = data;
      
      const licenseSnapshot = await adminDb.collection('licenses')
        .where('restaurant_id', '==', id)
        .limit(1)
        .get();

      if (licenseSnapshot.empty) {
        return NextResponse.json(
          { error: 'No license found' },
          { status: 404 }
        );
      }

      await licenseSnapshot.docs[0].ref.update({
        cloud_backup_enabled: cloud_backup_enabled === true,
        cloud_backup_activated_at: cloud_backup_enabled ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: `Cloud Backup ${cloud_backup_enabled ? 'enabled' : 'disabled'} successfully`,
        cloud_backup_enabled
      });
    }

    if (data.action === 'make_payment') {
      const { amount, days_to_add, payment_method, payment_id, notes } = data;

      // Get license
      const licenseSnapshot = await adminDb.collection('licenses')
        .where('restaurant_id', '==', id)
        .limit(1)
        .get();

      if (licenseSnapshot.empty) {
        return NextResponse.json(
          { error: 'No license found' },
          { status: 404 }
        );
      }

      const licenseDoc = licenseSnapshot.docs[0];
      const licenseData = licenseDoc.data();

      // Create payment record
      const paymentRef = await adminDb.collection('payments').add({
        restaurant_id: id,
        license_id: licenseDoc.id,
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

        await licenseDoc.ref.update({
          expiry_date: newExpiry.toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Payment recorded successfully',
        payment_id: paymentRef.id
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update restaurant error:', error);
    return NextResponse.json(
      { error: 'Failed to update restaurant', details: error.message },
      { status: 500 }
    );
  }
}
