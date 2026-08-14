import { adminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.business_name || !data.owner_name || !data.phone || !data.business_type) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create lead in Firebase
    const leadData = {
      business_name: data.business_name,
      owner_name: data.owner_name,
      email: data.email || null,
      phone: data.phone,
      city: data.city || null,
      state: data.state || null,
      address: data.address || null,
      business_type: data.business_type, // 'restaurant' or 'retail'
      notes: data.notes || null,
      status: 'pending', // pending, contacted, converted, rejected
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const leadRef = await adminDb.collection('leads').add(leadData);

    return Response.json({
      success: true,
      lead_id: leadRef.id,
      message: 'Registration received successfully'
    });

  } catch (error) {
    console.error('Error creating lead:', error);
    return Response.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = adminDb.collection('leads').orderBy('created_at', 'desc');
    
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return Response.json({ leads });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return Response.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
