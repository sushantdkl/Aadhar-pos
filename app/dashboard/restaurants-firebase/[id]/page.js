'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Key,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Ban,
  PlayCircle,
  Menu,
  Database
} from 'lucide-react';
import { formatDate, formatCurrency, getDaysRemaining } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import BackupViewer from '@/components/backup-viewer';

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showGraceModal, setShowGraceModal] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [showBackupViewer, setShowBackupViewer] = useState(false);
  const [cloudBackupEnabled, setCloudBackupEnabled] = useState(false);
  const [extensionDays, setExtensionDays] = useState(30);
  const [graceDays, setGraceDays] = useState(5);
  const [customExpiryDate, setCustomExpiryDate] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (params.id) {
      fetchRestaurant();
    }
  }, [params.id]);

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`/api/restaurants-firebase/${params.id}`);
      const data = await res.json();
      
      if (data.error) {
        console.error('API Error:', data.error);
        alert('Failed to load restaurant: ' + data.error);
        return;
      }
      
      if (data.restaurant) {
        setRestaurant(data.restaurant);
        setGraceDays(data.restaurant.grace_period_days || 5);
        setCloudBackupEnabled(data.restaurant.cloud_backup_enabled || false);
        
        // Extract license data
        if (data.restaurant.license_key) {
          setLicense({
            license_key: data.restaurant.license_key,
            expiry_date: data.restaurant.expiry_date,
            status: data.restaurant.license_status,
            plan_type: data.restaurant.plan_type,
            start_date: data.restaurant.start_date,
            grace_period_days: data.restaurant.grace_period_days || 5,
            cloud_backup_enabled: data.restaurant.cloud_backup_enabled || false
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch restaurant:', error);
      alert('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handleExtendExpiry = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/restaurants-firebase/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'extend_expiry',
          additional_days: extensionDays
        })
      });

      if (res.ok) {
        alert(`Expiry extended by ${extensionDays} days`);
        setShowExtendModal(false);
        fetchRestaurant();
      }
    } catch (error) {
      alert('Failed to extend expiry');
    } finally {
      setProcessing(false);
    }
  };

  const handleExtendGrace = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/restaurants-firebase/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'extend_grace',
          grace_days: graceDays
        })
      });

      if (res.ok) {
        alert(`Grace period updated to ${graceDays} days`);
        setShowGraceModal(false);
        fetchRestaurant();
      }
    } catch (error) {
      alert('Failed to update grace period');
    } finally {
      setProcessing(false);
    }
  };

  const handleSetCustomDate = async () => {
    if (!customExpiryDate) {
      alert('Please select a date');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(`/api/restaurants-firebase/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_custom_expiry',
          expiry_date: customExpiryDate
        })
      });

      if (res.ok) {
        alert('Expiry date updated successfully');
        setShowCustomDateModal(false);
        fetchRestaurant();
      }
    } catch (error) {
      alert('Failed to update expiry date');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleStatus = async () => {
    const action = restaurant.status === 'active' ? 'suspend' : 'activate';
    const confirmed = confirm(`Are you sure you want to ${action} this restaurant?`);
    
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/restaurants-firebase/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: action === 'suspend' ? 'suspended' : 'active'
        })
      });

      if (res.ok) {
        alert(`Restaurant ${action}d successfully`);
        fetchRestaurant();
      }
    } catch (error) {
      alert(`Failed to ${action} restaurant`);
    }
  };

  const handleToggleCloudBackup = async () => {
    const newState = !cloudBackupEnabled;
    const confirmed = confirm(
      newState 
        ? 'Enable Cloud Backup for this restaurant? This is a premium feature.'
        : 'Disable Cloud Backup for this restaurant?'
    );
    
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/restaurants-firebase/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'toggle_cloud_backup',
          cloud_backup_enabled: newState
        })
      });

      if (res.ok) {
        setCloudBackupEnabled(newState);
        alert(`Cloud Backup ${newState ? 'enabled' : 'disabled'} successfully`);
        fetchRestaurant();
      } else {
        alert('Failed to update cloud backup setting');
      }
    } catch (error) {
      console.error('Error toggling cloud backup:', error);
      alert('Failed to update cloud backup setting');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Restaurant not found</p>
      </div>
    );
  }

  const daysLeft = license?.expiry_date ? getDaysRemaining(license.expiry_date) : null;
  const isExpired = daysLeft !== null && daysLeft < 0;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage="restaurants-firebase" user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:ml-64 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/dashboard/restaurants-firebase')}
              className="p-2 hover:bg-gray-200 rounded-lg"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
              <p className="text-gray-600">{restaurant.location}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => setShowExtendModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700"
            >
              <Calendar className="w-5 h-5" />
              Add/Remove Days
            </button>
            <button
              onClick={() => setShowCustomDateModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700"
            >
              <Edit className="w-5 h-5" />
              Set Custom Date
            </button>
            <button
              onClick={() => setShowGraceModal(true)}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700"
            >
              <Clock className="w-5 h-5" />
              Grace Period
            </button>
            <button
              onClick={handleToggleStatus}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${
                restaurant.status === 'active'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {restaurant.status === 'active' ? <Ban className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
              {restaurant.status === 'active' ? 'Suspend' : 'Activate'}
            </button>
          </div>

          {/* License Status Card */}
          {license && (
            <div className={`rounded-lg border-2 p-6 mb-6 ${
              isExpired ? 'border-red-500 bg-red-50' : 
              isExpiringSoon ? 'border-yellow-500 bg-yellow-50' : 
              'border-green-500 bg-green-50'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Key className={`w-8 h-8 ${
                    isExpired ? 'text-red-600' : 
                    isExpiringSoon ? 'text-yellow-600' : 
                    'text-green-600'
                  }`} />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">License Status</h2>
                    <p className="text-sm text-gray-600">Active License Information</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isExpired ? (
                    <XCircle className="w-6 h-6 text-red-600" />
                  ) : isExpiringSoon ? (
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">License Key</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">{license.license_key}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Plan Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{license.plan_type?.replace('_', ' ')}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Expiry Date</p>
                  <p className={`font-semibold ${
                    isExpired ? 'text-red-600' : 
                    isExpiringSoon ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {formatDate(license.expiry_date)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Days Remaining</p>
                  <p className={`text-2xl font-bold ${
                    isExpired ? 'text-red-600' : 
                    isExpiringSoon ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {daysLeft > 0 ? daysLeft : 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Grace Period</p>
                  <p className="font-semibold text-gray-900">{license.grace_period_days || 5} days</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    isExpired ? 'bg-red-100 text-red-800' : 
                    isExpiringSoon ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Premium Features Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-600" />
              Premium Features
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Cloud Backup</h3>
                  <p className="text-sm text-gray-600">
                    Enable automatic cloud backup for this restaurant's data
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${cloudBackupEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                    {cloudBackupEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    onClick={handleToggleCloudBackup}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cloudBackupEnabled ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cloudBackupEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              {cloudBackupEnabled && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Cloud Backup Active</h4>
                      <p className="text-sm text-blue-800">
                        Restaurant can now upload backups to the cloud server. You can view and manage backups below.
                      </p>
                      <button
                        onClick={() => setShowBackupViewer(true)}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                      >
                        View Cloud Backups
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Restaurant Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurant Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="font-semibold text-gray-900">{restaurant.contact_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-semibold text-gray-900">{restaurant.contact_email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Owner</p>
                <p className="font-semibold text-gray-900">{restaurant.owner_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  restaurant.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Created</p>
                <p className="font-semibold text-gray-900">
                  {restaurant.created_at ? formatDate(restaurant.created_at) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Extend Expiry Modal */}
        {showExtendModal && license && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Add/Remove Days</h3>
              <p className="text-gray-600 mb-4">
                Current expiry: {formatDate(license.expiry_date)}
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days (use negative to reduce)
                </label>
                <input
                  type="number"
                  value={extensionDays || 0}
                  onChange={(e) => setExtensionDays(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Examples: 30 (add 30 days), -7 (remove 7 days)
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  New expiry date: {extensionDays ? 
                    new Date(new Date(license.expiry_date).getTime() + extensionDays * 24 * 60 * 60 * 1000)
                      .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'N/A'}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExtendModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtendExpiry}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Date Modal */}
        {showCustomDateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Set Custom Expiry Date</h3>
              <p className="text-gray-600 mb-4">
                Current expiry: {license?.expiry_date ? formatDate(license.expiry_date) : 'N/A'}
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Expiry Date
                </label>
                <input
                  type="date"
                  value={customExpiryDate}
                  onChange={(e) => setCustomExpiryDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCustomDateModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetCustomDate}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Set Date'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grace Period Modal */}
        {showGraceModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">Update Grace Period</h3>
              <p className="text-gray-600 mb-4">
                Current grace period: {license?.grace_period_days || 5} days
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grace Period (Days)
                </label>
                <input
                  type="number"
                  value={graceDays || 0}
                  onChange={(e) => setGraceDays(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  min="0"
                  max="90"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Days after expiry before system locks out (0-90 days)
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-purple-800">
                  <strong>Grace Period:</strong> Restaurant can continue operating for {graceDays} days after license expires.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGraceModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtendGrace}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Backup Viewer */}
        {showBackupViewer && license && (
          <BackupViewer
            licenseKey={license.license_key}
            shopName={restaurant.name}
            onClose={() => setShowBackupViewer(false)}
          />
        )}
      </div>
    </div>
  );
}
