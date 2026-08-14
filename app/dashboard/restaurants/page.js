'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store,
  Plus,
  Search,
  Menu,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  X,
  Trash2
} from 'lucide-react';
import { formatDate, getDaysRemaining, PLAN_TYPES } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';

export default function RestaurantsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, restaurant: null, step: 1 });
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    owner_name: '',
    contact_number: '',
    contact_email: '',
    location: '',
    plan_type: 'monthly',
  });

  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch('/api/restaurants-firebase');
      const data = await res.json();
      setRestaurants(data.restaurants);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/restaurants-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        fetchRestaurants();
        setFormData({
          name: '',
          owner_name: '',
          contact_number: '',
          contact_email: '',
          location: '',
          plan_type: 'monthly',
        });
        alert('Restaurant added successfully!');
      }
    } catch (error) {
      console.error('Failed to add restaurant:', error);
      alert('Failed to add restaurant');
    }
  };

  const handlePlanChange = (planKey) => {
    setFormData({
      ...formData,
      plan_type: planKey,
    });
  };

  const initiateDelete = (restaurant, e) => {
    e.stopPropagation();
    setDeleteConfirm({ show: true, restaurant, step: 1 });
    setDeleteInput('');
  };

  const confirmDelete = async () => {
    if (deleteConfirm.step === 1) {
      setDeleteConfirm({ ...deleteConfirm, step: 2 });
      return;
    }

    if (deleteConfirm.step === 2) {
      if (deleteInput !== deleteConfirm.restaurant.name) {
        alert('Restaurant name does not match. Please type exactly: ' + deleteConfirm.restaurant.name);
        return;
      }
      setDeleteConfirm({ ...deleteConfirm, step: 3 });
      setDeleteInput('');
      return;
    }

    if (deleteConfirm.step === 3) {
      if (deleteInput.toUpperCase() !== 'DELETE PERMANENTLY') {
        alert('Please type exactly: DELETE PERMANENTLY');
        return;
      }

      setDeleting(true);
      try {
        const res = await fetch(`/api/restaurants-firebase?id=${deleteConfirm.restaurant.id}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          const result = await res.json();
          alert(`Successfully deleted ${result.deleted.restaurant}\n\nDeleted:\n- ${result.deleted.licenses} license(s)\n- ${result.deleted.payments} payment(s)\n- ${result.deleted.shops} shop(s)`);
          setDeleteConfirm({ show: false, restaurant: null, step: 1 });
          fetchRestaurants();
        } else {
          const error = await res.json();
          alert('Failed to delete: ' + error.error);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete restaurant');
      } finally {
        setDeleting(false);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, restaurant: null, step: 1 });
    setDeleteInput('');
  };

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.owner_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.contact_number || r.phone || '').includes(searchTerm)
  );

  // Calculate expiry statistics
  const expiredRestaurants = restaurants.filter(r => {
    if (!r.expiry_date) return false;
    const daysLeft = getDaysRemaining(r.expiry_date);
    return daysLeft < 0;
  });

  const expiringSoonRestaurants = restaurants.filter(r => {
    if (!r.expiry_date) return false;
    const daysLeft = getDaysRemaining(r.expiry_date);
    return daysLeft >= 0 && daysLeft <= 7;
  });

  const inGracePeriodRestaurants = restaurants.filter(r => {
    if (!r.expiry_date) return false;
    const daysLeft = getDaysRemaining(r.expiry_date);
    const graceDays = r.grace_period_days || 5;
    return daysLeft < 0 && daysLeft >= -graceDays;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage="restaurants" user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-64">
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Restaurants</h2>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Restaurant
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Alert Banners */}
          {expiredRestaurants.length > 0 && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-red-900 font-bold text-lg">
                    🚨 {expiredRestaurants.length} Restaurant{expiredRestaurants.length > 1 ? 's' : ''} Expired
                  </h3>
                  <p className="text-red-700 text-sm mt-1">
                    {inGracePeriodRestaurants.length > 0 && (
                      <span>{inGracePeriodRestaurants.length} in grace period. </span>
                    )}
                    Immediate action required to prevent system lockout.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {expiredRestaurants.slice(0, 5).map(r => (
                      <button
                        key={r.id}
                        onClick={() => router.push(`/dashboard/restaurants/${r.id}`)}
                        className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-full font-medium transition-colors"
                      >
                        {r.name}
                      </button>
                    ))}
                    {expiredRestaurants.length > 5 && (
                      <span className="text-xs text-red-700 px-3 py-1">
                        +{expiredRestaurants.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {expiringSoonRestaurants.length > 0 && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-900 font-bold text-lg">
                    ⚠️ {expiringSoonRestaurants.length} Restaurant{expiringSoonRestaurants.length > 1 ? 's' : ''} Expiring Soon
                  </h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Licenses expiring within 7 days. Extend now to avoid disruption.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {expiringSoonRestaurants.slice(0, 5).map(r => {
                      const daysLeft = getDaysRemaining(r.expiry_date);
                      return (
                        <button
                          key={r.id}
                          onClick={() => router.push(`/dashboard/restaurants/${r.id}`)}
                          className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-medium transition-colors"
                        >
                          {r.name} ({daysLeft} day{daysLeft !== 1 ? 's' : ''})
                        </button>
                      );
                    })}
                    {expiringSoonRestaurants.length > 5 && (
                      <span className="text-xs text-yellow-700 px-3 py-1">
                        +{expiringSoonRestaurants.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {expiredRestaurants.length === 0 && expiringSoonRestaurants.length === 0 && restaurants.length > 0 && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-green-900 font-bold text-lg">
                    ✅ All Licenses Active
                  </h3>
                  <p className="text-green-700 text-sm mt-1">
                    All {restaurants.length} restaurant{restaurants.length > 1 ? 's' : ''} have active licenses with no immediate concerns.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Restaurants Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => {
              const daysLeft = restaurant.expiry_date ? getDaysRemaining(restaurant.expiry_date) : null;
              const isExpired = daysLeft !== null && daysLeft < 0;
              const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

              return (
                <div 
                  key={restaurant.id} 
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow relative group"
                >
                  {/* Delete Button - Top Right */}
                  <button
                    onClick={(e) => initiateDelete(restaurant, e)}
                    className="absolute top-3 right-3 p-2 bg-red-50 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 z-10"
                    title="Delete Restaurant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="p-6 cursor-pointer" onClick={() => router.push(`/dashboard/restaurants/${restaurant.id}`)}>
                    <div className="flex items-start justify-between mb-4 pr-8">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-blue-600">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600">{restaurant.owner_name}</p>
                      </div>
                      {restaurant.license_status === 'active' && !isExpired ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {restaurant.contact_number || restaurant.phone}
                      </div>
                      {(restaurant.contact_email || restaurant.email) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {restaurant.contact_email || restaurant.email}
                        </div>
                      )}
                      {restaurant.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {restaurant.location}
                        </div>
                      )}
                    </div>

                    {restaurant.license_key && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">License Key</p>
                        <code className="text-sm font-mono text-gray-900">{restaurant.license_key}</code>
                      </div>
                    )}

                    {restaurant.expiry_date && (
                      <div className={`p-3 rounded-lg ${
                        isExpired ? 'bg-red-50 border border-red-200' :
                        isExpiringSoon ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-green-50 border border-green-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Expires on</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(restaurant.expiry_date)}</p>
                          </div>
                          <div className={`text-right ${
                            isExpired ? 'text-red-600' :
                            isExpiringSoon ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            <Clock className="w-5 h-5 mx-auto mb-1" />
                            <p className="text-xs font-medium">
                              {daysLeft > 0 ? `${daysLeft} days` : `${Math.abs(daysLeft)} days ago`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredRestaurants.length === 0 && !loading && (
            <div className="text-center py-12">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No restaurants found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Restaurant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Add New Restaurant</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.contact_number}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="City, State or Full Address"
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Subscription Plan</h4>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {Object.entries(PLAN_TYPES).map(([key, plan]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handlePlanChange(key)}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        formData.plan_type === key
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">{plan.label}</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">₹{plan.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Multi-Step */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b bg-red-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-900">Delete Restaurant</h3>
                  <p className="text-sm text-red-700">Step {deleteConfirm.step} of 3</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {deleteConfirm.step === 1 && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ You are about to delete:
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {deleteConfirm.restaurant.name}
                    </p>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-red-900 mb-2">This will permanently delete:</p>
                    <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                      <li>Restaurant information</li>
                      <li>All license data</li>
                      <li>Payment history</li>
                      <li>Associated shops</li>
                      <li>All related records</li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-600 font-medium">
                    ⚠️ <strong>This action cannot be undone!</strong>
                  </p>
                </div>
              )}

              {deleteConfirm.step === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    To confirm deletion, please type the restaurant name exactly:
                  </p>
                  <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                    <p className="font-mono font-bold text-gray-900">
                      {deleteConfirm.restaurant.name}
                    </p>
                  </div>
                  <input
                    type="text"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    placeholder="Type restaurant name here"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              )}

              {deleteConfirm.step === 3 && (
                <div className="space-y-4">
                  <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
                    <p className="text-sm font-bold text-red-900 mb-2">
                      🚨 FINAL CONFIRMATION
                    </p>
                    <p className="text-sm text-red-800">
                      This is your last chance. Type <strong>DELETE PERMANENTLY</strong> to confirm:
                    </p>
                  </div>
                  <input
                    type="text"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    placeholder="Type: DELETE PERMANENTLY"
                    className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-bold"
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold disabled:opacity-50 ${
                  deleteConfirm.step === 3
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}
              >
                {deleting ? 'Deleting...' : deleteConfirm.step === 3 ? 'DELETE PERMANENTLY' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
