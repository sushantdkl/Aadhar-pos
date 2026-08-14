'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store,
  ShoppingBag,
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
  Building2,
  Filter,
  Trash2,
  X
} from 'lucide-react';
import { formatDate, getDaysRemaining, PLAN_TYPES } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';

export default function BusinessesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businessType, setBusinessType] = useState('restaurant'); // restaurant or retail
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, business: null, step: 1 });
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    owner_name: '',
    phone: '',
    email: '',
    address: '',
    type: 'restaurant'
  });

  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      // Fetch both restaurants and shops
      const [restaurantsRes, shopsRes] = await Promise.all([
        fetch('/api/restaurants-firebase'),
        fetch('/api/shops-firebase')
      ]);

      const restaurantsData = await restaurantsRes.json();
      const shopsData = await shopsRes.json();

      // Combine and normalize data
      const allBusinesses = [
        ...(restaurantsData.restaurants || []).map(r => ({
          ...r,
          type: 'restaurant',
          displayType: 'Restaurant'
        })),
        ...(shopsData.shops || []).map(s => ({
          ...s,
          type: 'retail',
          displayType: 'Retail Shop'
        }))
      ];

      setBusinesses(allBusinesses);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = formData.type === 'retail' ? '/api/shops-firebase' : '/api/restaurants-firebase';
      
      // Normalize field names for both types
      const payload = formData.type === 'retail' ? {
        name: formData.name,
        owner_name: formData.owner_name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address
      } : {
        name: formData.name,
        owner_name: formData.owner_name,
        contact_number: formData.phone,
        contact_email: formData.email,
        location: formData.address
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        fetchBusinesses();
        setFormData({
          name: '',
          owner_name: '',
          phone: '',
          email: '',
          address: '',
          type: 'restaurant'
        });
        alert(`${formData.type === 'retail' ? 'Shop' : 'Restaurant'} added successfully!`);
      }
    } catch (error) {
      console.error('Failed to add business:', error);
      alert('Failed to add business');
    }
  };

  const initiateDelete = (business, e) => {
    e.stopPropagation();
    setDeleteConfirm({ show: true, business, step: 1 });
    setDeleteInput('');
  };

  const confirmDelete = async () => {
    if (deleteConfirm.step === 1) {
      setDeleteConfirm({ ...deleteConfirm, step: 2 });
      return;
    }

    if (deleteConfirm.step === 2) {
      if (deleteInput !== deleteConfirm.business.name) {
        alert('Business name does not match. Please type exactly: ' + deleteConfirm.business.name);
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
        const endpoint = deleteConfirm.business.type === 'retail' 
          ? `/api/shops-firebase?id=${deleteConfirm.business.id}`
          : `/api/restaurants-firebase?id=${deleteConfirm.business.id}`;

        const res = await fetch(endpoint, {
          method: 'DELETE'
        });

        if (res.ok) {
          const result = await res.json();
          const deletedName = result.deleted.restaurant || result.deleted.shop;
          alert(`Successfully deleted ${deletedName}\n\nDeleted:\n- ${result.deleted.licenses} license(s)\n- ${result.deleted.payments} payment(s)${result.deleted.shops ? `\n- ${result.deleted.shops} shop(s)` : ''}`);
          setDeleteConfirm({ show: false, business: null, step: 1 });
          fetchBusinesses();
        } else {
          const error = await res.json();
          alert('Failed to delete: ' + error.error);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete business');
      } finally {
        setDeleting(false);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, business: null, step: 1 });
    setDeleteInput('');
  };

  const filteredBusinesses = businesses.filter(b => {
    // Search filter
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.owner_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.phone || b.contact_number || '').includes(searchTerm);
    
    // Type filter
    const matchesType = typeFilter === 'all' || b.type === typeFilter;
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        matchesStatus = b.status === 'active' || b.license_status === 'active';
      } else if (statusFilter === 'inactive') {
        matchesStatus = b.status === 'inactive' || b.license_status === 'inactive';
      } else if (statusFilter === 'expired') {
        matchesStatus = b.status === 'expired' || b.license_status === 'expired';
      }
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage="businesses" user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold">All Businesses</h2>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              <span>Add Business</span>
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatsCard
              label="Total Businesses"
              value={businesses.length}
              icon={Building2}
              color="blue"
            />
            <StatsCard
              label="Restaurants"
              value={businesses.filter(b => b.type === 'restaurant').length}
              icon={Store}
              color="green"
            />
            <StatsCard
              label="Retail Shops"
              value={businesses.filter(b => b.type === 'retail').length}
              icon={ShoppingBag}
              color="purple"
            />
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Business Type Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="all">All Types</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="retail">Retail Shop</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Businesses Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBusinesses.map((business) => (
                  <tr key={`${business.type}-${business.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        business.type === 'restaurant' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {business.type === 'restaurant' ? (
                          <><Store className="w-3 h-3 mr-1" /> Restaurant</>
                        ) : (
                          <><ShoppingBag className="w-3 h-3 mr-1" /> Retail</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{business.name}</div>
                      <div className="text-sm text-gray-500">{business.address || business.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {business.owner_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{business.phone || business.contact_number}</div>
                      <div className="text-sm text-gray-500">{business.email || business.contact_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        business.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {business.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => router.push(
                          business.type === 'restaurant'
                            ? `/dashboard/restaurants/${business.id}`
                            : `/dashboard/shops/${business.id}`
                        )}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => initiateDelete(business, e)}
                        className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                        title="Delete Business"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Business Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add New Business</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Business Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'restaurant'})}
                    className={`p-3 rounded-lg border-2 text-left ${
                      formData.type === 'restaurant'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <Store className="w-5 h-5 mb-1 text-blue-600" />
                    <div className="font-medium">Restaurant</div>
                    <div className="text-xs text-gray-500">Dine-in services</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'retail'})}
                    className={`p-3 rounded-lg border-2 text-left ${
                      formData.type === 'retail'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5 mb-1 text-purple-600" />
                    <div className="font-medium">Retail Shop</div>
                    <div className="text-xs text-gray-500">Retail store</div>
                  </button>
                </div>
              </div>

              <input
                type="text"
                placeholder="Business Name"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Owner Name"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.owner_name}
                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <textarea
                placeholder="Address"
                className="w-full px-3 py-2 border rounded-lg"
                rows="2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b bg-red-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-900">Delete Business</h3>
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
                      {deleteConfirm.business.name} ({deleteConfirm.business.displayType})
                    </p>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-red-900 mb-2">This will permanently delete:</p>
                    <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                      <li>Business information</li>
                      <li>All license data</li>
                      <li>Payment history</li>
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
                    To confirm deletion, please type the business name exactly:
                  </p>
                  <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                    <p className="font-mono font-bold text-gray-900">
                      {deleteConfirm.business.name}
                    </p>
                  </div>
                  <input
                    type="text"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    placeholder="Type business name here"
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

function StatsCard({ label, value, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
