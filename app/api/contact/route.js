import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    const contactsSnapshot = await adminDb.collection('contacts')
      .orderBy('created_at', 'desc')
      .get();
    
    const contacts = contactsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
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
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Create contact document
    const contactRef = await adminDb.collection('contacts').add({
      name: data.name,
      email: data.email,
      phone: data.phone,
      business_type: data.businessType || '',
      message: data.message || '',
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      contact_id: contactRef.id
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
