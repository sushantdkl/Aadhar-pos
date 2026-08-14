'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, RefreshCw, CheckCircle, XCircle, AlertCircle, Database, Eye } from 'lucide-react';

export default function RestaurantsFirebasePage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGraceModal, setShowGraceModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showCloudBackupModal, setShowCloudBackupModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [cloudBackupEnabled, setCloudBackupEnabled] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact_number: '',
    contact_email: '',
    owner_name: '',
    plan_type: 'monthly'
  });

  const [renewData, setRenewData] = useState({
    plan_type: 'monthly',
    payment_method: 'cash'
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants-firebase');
      const data = await response.json();
      setRestaurants(data.restaurants || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const response = await fetch('/api/restaurants-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Restaurant added successfully!\n\nLicense Key: ${data.license.license_key}\n\nPlease save this license key!`);
        setShowAddModal(false);
        setFormData({
          name: '',
          location: '',
          contact_number: '',
          contact_email: '',
          owner_name: '',
          plan_type: 'monthly'
        });
        fetchRestaurants();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to add restaurant: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!selectedRestaurant) return;

    setActionLoading(true);

    try {
      const response = await fetch(`/api/restaurants-firebase?id=${selectedRestaurant.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Restaurant deleted successfully!\n\nDeleted:\n- ${data.deletedCounts.licenses} license(s)\n- ${data.deletedCounts.payments} payment(s)\n- ${data.deletedCounts.logs} log(s)`);
        setShowDeleteModal(false);
        setSelectedRestaurant(null);
        fetchRestaurants();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to delete restaurant: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRenewLicense = async (e) => {
    e.preventDefault();
    if (!selectedRestaurant?.license) return;

    setActionLoading(true);

    try {
      const response = await fetch('/api/licenses-firebase/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: selectedRestaurant.license.license_key,
          ...renewData
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ License renewed successfully!\n\nNew expiry: ${new Date(data.license.expiry_date).toLocaleDateString()}\nAmount: ₹${data.payment.amount}`);
        setShowRenewModal(false);
        setSelectedRestaurant(null);
        setRenewData({ plan_type: 'monthly', payment_method: 'cash' });
        fetchRestaurants();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to renew license: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getDaysRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const days = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleToggleCloudBackup = async (restaurant) => {
    const newState = !restaurant.cloud_backup_enabled;
    const confirmed = confirm(
      newState 
        ? 'Enable Cloud Backup for this restaurant? This is a premium feature.'
        : 'Disable Cloud Backup for this restaurant?'
    );
    
    if (!confirmed) return;

    try {
      setActionLoading(true);
      const res = await fetch(`/api/restaurants-firebase/${restaurant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'toggle_cloud_backup',
          cloud_backup_enabled: newState
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Cloud Backup ${newState ? 'enabled' : 'disabled'} successfully`);
        fetchRestaurants();
      } else {
        alert('Failed to update cloud backup setting: ' + data.error);
      }
    } catch (error) {
      alert('Failed to update cloud backup setting');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (license) => {
    if (!license) return <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">No License</span>;
    
    const days = getDaysRemaining(license.expiry_date);
    
    if (days < 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs flex items-center gap-1"><XCircle size={12} /> Expired</span>;
    } else if (days <= 7) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs flex items-center gap-1"><AlertCircle size={12} /> Expiring Soon</span>;
    } else {
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1"><CheckCircle size={12} /> Active</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🔥 Restaurants (Firebase)</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Restaurant
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{restaurant.name}</div>
                  <div className="text-sm text-gray-500">{restaurant.location}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div>{restaurant.contact_number}</div>
                  <div className="text-gray-500">{restaurant.contact_email}</div>
                </td>
                <td className="px-6 py-4">
                  {restaurant.license ? (
                    <div className="text-sm">
                      <div className="font-mono text-xs">{restaurant.license.license_key}</div>
                      <div className="text-gray-500 capitalize">{restaurant.license.plan_type?.replace('_', ' ')}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">No license</span>
                  )}
                </td>
                <td className="px-6 py-4">{getStatusBadge(restaurant.license)}</td>
                <td className="px-6 py-4 text-sm">
                  {restaurant.license ? (
                    <div>
                      <div>{new Date(restaurant.license.expiry_date).toLocaleDateString()}</div>
                      <div className="text-gray-500">{getDaysRemaining(restaurant.license.expiry_date)} days</div>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/restaurants-firebase/${restaurant.id}`)}
                      className="text-purple-600 hover:text-purple-800"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {restaurant.license && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedRestaurant(restaurant);
                            setShowRenewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Renew License"
                        >
                          <RefreshCw size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleCloudBackup(restaurant)}
                          className={restaurant.cloud_backup_enabled ? "text-green-600 hover:text-green-800" : "text-gray-400 hover:text-gray-600"}
                          title={restaurant.cloud_backup_enabled ? "Cloud Backup Enabled" : "Cloud Backup Disabled"}
                        >
                          <Database size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedRestaurant(restaurant);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Restaurant"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Restaurant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Add New Restaurant</h2>
            <form onSubmit={handleAddRestaurant}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Restaurant Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="The Wild Stars"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Mumbai, Maharashtra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.contact_number}
                    onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="contact@restaurant.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({...formData, owner_name: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Plan Type *</label>
                  <select
                    required
                    value={formData.plan_type}
                    onChange={(e) => setFormData({...formData, plan_type: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="monthly">Monthly - ₹999</option>
                    <option value="semi_annual">Semi-Annual - ₹4,999</option>
                    <option value="annual">Annual - ₹8,999</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Adding...' : 'Add Restaurant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-red-600">Delete Restaurant?</h2>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="font-bold text-red-900 mb-2">⚠️ WARNING: This action cannot be undone!</p>
              <p className="text-red-800 text-sm mb-2">You are about to permanently delete:</p>
              <ul className="text-red-800 text-sm list-disc list-inside space-y-1">
                <li><strong>{selectedRestaurant.name}</strong></li>
                <li>All license data</li>
                <li>All payment records</li>
                <li>All verification logs</li>
              </ul>
            </div>

            <div className="bg-gray-100 rounded p-3 mb-4">
              <p className="text-sm text-gray-700 mb-2">Please type the restaurant name to confirm:</p>
              <p className="font-bold text-gray-900 mb-2">{selectedRestaurant.name}</p>
              <input
                type="text"
                className="w-full border-2 border-red-300 rounded px-3 py-2 focus:border-red-500 focus:outline-none"
                placeholder="Type restaurant name here"
                id="confirmName"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedRestaurant(null);
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById('confirmName');
                  if (input.value === selectedRestaurant.name) {
                    handleDeleteRestaurant();
                  } else {
                    alert('Restaurant name does not match. Please type the exact name.');
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Yes, Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renew License Modal */}
      {showRenewModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Renew License</h2>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="font-bold text-blue-900">{selectedRestaurant.name}</p>
              <p className="text-sm text-blue-800">Current Expiry: {new Date(selectedRestaurant.license.expiry_date).toLocaleDateString()}</p>
              <p className="text-sm text-blue-800">License: {selectedRestaurant.license.license_key}</p>
            </div>
            <form onSubmit={handleRenewLicense}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Renewal Plan *</label>
                  <select
                    required
                    value={renewData.plan_type}
                    onChange={(e) => setRenewData({...renewData, plan_type: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="monthly">Monthly - ₹999 (+1 month)</option>
                    <option value="semi_annual">Semi-Annual - ₹4,999 (+6 months)</option>
                    <option value="annual">Annual - ₹8,999 (+12 months)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method *</label>
                  <select
                    required
                    value={renewData.payment_method}
                    onChange={(e) => setRenewData({...renewData, payment_method: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowRenewModal(false);
                    setSelectedRestaurant(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Renewing...' : 'Renew License'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
