'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Store, Utensils, Phone, Mail, MapPin, Clock, CheckCircle, XCircle, Eye, ArrowRight } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { formatDate } from '@/lib/utils';

export default function LeadsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchLeads();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter(lead => lead.status === statusFilter));
    }
  }, [statusFilter, leads]);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        alert('Status updated successfully!');
        fetchLeads();
        setShowDetailModal(false);
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleConvertToLicense = async () => {
    if (!selectedLead) return;

    const confirmed = confirm(
      `Convert "${selectedLead.business_name}" to ${selectedLead.business_type === 'restaurant' ? 'Restaurant' : 'Retail Shop'} with license?`
    );

    if (!confirmed) return;

    setConverting(true);
    try {
      // Generate license key based on business type
      // Restaurant: POS-YYYY-XXXXXXXX-YYYYYYYY
      // Retail: RETAIL-YYYY-XXXXXXXX-YYYYYYYY
      const year = new Date().getFullYear();
      const random1 = Math.random().toString(36).substring(2, 10);
      const random2 = Math.random().toString(36).substring(2, 10).toUpperCase();
      const licenseKey = selectedLead.business_type === 'restaurant' 
        ? `POS-${year}-${random1}-${random2}`
        : `RETAIL-${year}-${random1}-${random2}`;

      // Calculate expiry date (30 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      if (selectedLead.business_type === 'restaurant') {
        // Create restaurant
        const res = await fetch('/api/restaurants-firebase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: selectedLead.business_name,
            owner_name: selectedLead.owner_name,
            contact_number: selectedLead.phone,
            contact_email: selectedLead.email || '',
            location: selectedLead.address || `${selectedLead.city || ''}, ${selectedLead.state || ''}`.trim() || 'Not specified',
            license_key: licenseKey,
            plan_type: 'monthly',
            expiry_date: expiryDate.toISOString().split('T')[0],
            grace_period_days: 5,
            status: 'active',
            license_status: 'active'
          })
        });

        if (res.ok) {
          const data = await res.json();
          // Mark lead as converted
          await handleUpdateStatus(selectedLead.id, 'converted');
          alert(`✅ Restaurant created successfully with license: ${licenseKey}`);
          router.push(`/dashboard/restaurants/${data.restaurant_id}`);
        } else {
          throw new Error('Failed to create restaurant');
        }
      } else {
        // Create retail shop with license
        const shopRes = await fetch('/api/shops-firebase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: selectedLead.business_name,
            owner_name: selectedLead.owner_name,
            phone: selectedLead.phone,
            email: selectedLead.email || '',
            address: selectedLead.address || '',
            status: 'active'
          })
        });

        if (!shopRes.ok) {
          const shopError = await shopRes.json();
          console.error('Shop creation failed:', shopError);
          throw new Error(`Failed to create shop: ${shopError.error || 'Unknown error'}`);
        }
        const shopData = await shopRes.json();
        console.log('Shop created:', shopData);

        // Create license for the shop
        const licenseRes = await fetch('/api/licenses-firebase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            license_key: licenseKey,
            business_id: shopData.shop_id,
            business_type: 'retail',
            plan_type: 'monthly',
            plan_duration: 1,
            expiry_date: expiryDate.toISOString().split('T')[0],
            grace_period_days: 5,
            status: 'active'
          })
        });

        if (licenseRes.ok) {
          await handleUpdateStatus(selectedLead.id, 'converted');
          alert(`✅ Retail shop created successfully with license: ${licenseKey}`);
          router.push(`/dashboard/shops/${shopData.shop_id}`);
        } else {
          const errorData = await licenseRes.json();
          console.error('License creation failed:', errorData);
          throw new Error(`Failed to create license: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Conversion error:', error);
      alert('❌ Failed to convert lead: ' + error.message);
    } finally {
      setConverting(false);
    }
  };

  const stats = {
    total: leads.length,
    pending: leads.filter(l => l.status === 'pending').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
    rejected: leads.filter(l => l.status === 'rejected').length,
    restaurants: leads.filter(l => l.business_type === 'restaurant').length,
    retail: leads.filter(l => l.business_type === 'retail').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage="leads" user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads & Registrations</h1>
            <p className="text-gray-600">Manage business registration requests from the landing page</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <p className="text-sm text-gray-600 mb-1">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
              <p className="text-sm text-yellow-700 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
              <p className="text-sm text-blue-700 mb-1">Contacted</p>
              <p className="text-2xl font-bold text-blue-900">{stats.contacted}</p>
            </div>
            <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
              <p className="text-sm text-green-700 mb-1">Converted</p>
              <p className="text-2xl font-bold text-green-900">{stats.converted}</p>
            </div>
            <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
              <p className="text-sm text-red-700 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>
            <div className="bg-orange-50 rounded-lg shadow-sm border border-orange-200 p-4">
              <p className="text-sm text-orange-700 mb-1">Restaurants</p>
              <p className="text-2xl font-bold text-orange-900">{stats.restaurants}</p>
            </div>
            <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-4">
              <p className="text-sm text-purple-700 mb-1">Retail</p>
              <p className="text-2xl font-bold text-purple-900">{stats.retail}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  statusFilter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setStatusFilter('contacted')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  statusFilter === 'contacted'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Contacted ({stats.contacted})
              </button>
              <button
                onClick={() => setStatusFilter('converted')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  statusFilter === 'converted'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Converted ({stats.converted})
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  statusFilter === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>

          {/* Leads List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {lead.business_type === 'restaurant' ? (
                            <Utensils className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Store className="w-4 h-4 text-blue-600" />
                          )}
                          <span className="font-semibold text-gray-900">{lead.business_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{lead.owner_name}</td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                          {lead.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          lead.business_type === 'restaurant'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {lead.business_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {lead.city || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          lead.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLeads.length === 0 && (
                <p className="text-center text-gray-600 py-8">No leads found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Lead Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Business Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Business Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Business Name</p>
                    <p className="font-semibold text-gray-900">{selectedLead.business_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Business Type</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedLead.business_type === 'restaurant'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedLead.business_type}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Owner Name</p>
                    <p className="font-semibold text-gray-900">{selectedLead.owner_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedLead.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedLead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                      selectedLead.status === 'converted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedLead.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{selectedLead.phone}</span>
                  </div>
                  {selectedLead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedLead.email}</span>
                    </div>
                  )}
                  {(selectedLead.city || selectedLead.state) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {[selectedLead.city, selectedLead.state].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedLead.address && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Full Address</p>
                      <p className="text-gray-900">{selectedLead.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedLead.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLead.notes}</p>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    Created: {formatDate(selectedLead.created_at)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    Last Updated: {formatDate(selectedLead.updated_at)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
                
                {/* Convert to License Button */}
                <div className="mb-4">
                  <button
                    onClick={handleConvertToLicense}
                    disabled={converting || selectedLead.status === 'converted'}
                    className={`w-full px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                      selectedLead.status === 'converted'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : selectedLead.business_type === 'restaurant'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg'
                    }`}
                  >
                    {converting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Converting...
                      </>
                    ) : selectedLead.status === 'converted' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Already Converted
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5" />
                        Convert to {selectedLead.business_type === 'restaurant' ? 'Restaurant' : 'Retail Shop'} License
                      </>
                    )}
                  </button>
                </div>

                {/* Status Update Buttons */}
                <h5 className="text-sm font-medium text-gray-700 mb-2">Update Status</h5>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'contacted')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Mark as Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'converted')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Mark as Converted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Mark as Rejected
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'pending')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Mark as Pending
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
