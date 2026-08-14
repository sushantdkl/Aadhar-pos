import { adminDb } from '@/lib/firebase-admin';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const leadRef = adminDb.collection('leads').doc(id);
    const leadDoc = await leadRef.get();

    if (!leadDoc.exists) {
      return Response.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const updates = {
      ...data,
      updated_at: new Date().toISOString()
    };

    await leadRef.update(updates);

    return Response.json({
      success: true,
      message: 'Lead updated successfully'
    });

  } catch (error) {
    console.error('Error updating lead:', error);
    return Response.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await adminDb.collection('leads').doc(id).delete();

    return Response.json({
      success: true,
      message: 'Lead deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting lead:', error);
    return Response.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
