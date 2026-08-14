'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
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
  Database,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import BackupViewer from '@/components/backup-viewer';

export default function ShopsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBackupViewer, setShowBackupViewer] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, shop: null, step: 1 });
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    owner_name: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await fetch('/api/shops-firebase');
      const data = await res.json();
      setShops(data.shops || []);
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/shops-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        fetchShops();
        setFormData({
          name: '',
          owner_name: '',
          phone: '',
          email: '',
          address: ''
        });
        alert('Shop added successfully!');
      }
    } catch (error) {
      console.error('Failed to add shop:', error);
      alert('Failed to add shop');
    }
  };

  const initiateDelete = (shop, e) => {
    e.stopPropagation();
    setDeleteConfirm({ show: true, shop, step: 1 });
    setDeleteInput('');
  };

  const confirmDelete = async () => {
    if (deleteConfirm.step === 1) {
      setDeleteConfirm({ ...deleteConfirm, step: 2 });
      return;
    }

    if (deleteConfirm.step === 2) {
      if (deleteInput !== deleteConfirm.shop.name) {
        alert('Shop name does not match. Please type exactly: ' + deleteConfirm.shop.name);
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
        const res = await fetch(`/api/shops-firebase?id=${deleteConfirm.shop.id}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          const result = await res.json();
          alert(`Successfully deleted ${result.deleted.shop}\n\nDeleted:\n- ${result.deleted.licenses} license(s)\n- ${result.deleted.payments} payment(s)`);
          setDeleteConfirm({ show: false, shop: null, step: 1 });
          fetchShops();
        } else {
          const error = await res.json();
          alert('Failed to delete: ' + error.error);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete shop');
      } finally {
        setDeleting(false);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, shop: null, step: 1 });
    setDeleteInput('');
  };

  const filteredShops = shops.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.owner_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.phone || '').includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage="shops" user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
              <h2 className="text-2xl font-bold">Retail Shops</h2>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-5 h-5" />
              <span>Add Shop</span>
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatsCard
              label="Total Shops"
              value={shops.length}
              icon={ShoppingBag}
              color="purple"
            />
            <StatsCard
              label="Active Shops"
              value={shops.filter(s => s.status === 'active').length}
              icon={CheckCircle}
              color="green"
            />
            <StatsCard
              label="Suspended"
              value={shops.filter(s => s.status === 'suspended').length}
              icon={XCircle}
              color="red"
            />
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search shops by name, owner, or phone..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Shops Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
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
                {filteredShops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ShoppingBag className="w-5 h-5 text-purple-600 mr-2" />
                        <div className="font-medium text-gray-900">{shop.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shop.owner_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {shop.phone}
                      </div>
                      {shop.email && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="w-4 h-4 mr-1 text-gray-400" />
                          {shop.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {shop.address || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        shop.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {shop.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {shop.license_key && (
                        <button
                          onClick={() => {
                            setSelectedShop(shop);
                            setShowBackupViewer(true);
                          }}
                          className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                        >
                          <Database className="w-4 h-4 mr-1" />
                          View Backup
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/dashboard/shops/${shop.id}`)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => initiateDelete(shop, e)}
                        className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                        title="Delete Shop"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredShops.length === 0 && (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No shops found</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add First Shop
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Shop Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add New Shop</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Shop Name"
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
                placeholder="Shop Address"
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
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Backup Viewer */}
      {showBackupViewer && selectedShop && (
        <BackupViewer
          licenseKey={selectedShop.license_key}
          shopName={selectedShop.name}
          onClose={() => {
            setShowBackupViewer(false);
            setSelectedShop(null);
          }}
        />
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
                  <h3 className="text-xl font-bold text-red-900">Delete Shop</h3>
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
                      {deleteConfirm.shop.name}
                    </p>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-red-900 mb-2">This will permanently delete:</p>
                    <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                      <li>Shop information</li>
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
                    To confirm deletion, please type the shop name exactly:
                  </p>
                  <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                    <p className="font-mono font-bold text-gray-900">
                      {deleteConfirm.shop.name}
                    </p>
                  </div>
                  <input
                    type="text"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    placeholder="Type shop name here"
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
