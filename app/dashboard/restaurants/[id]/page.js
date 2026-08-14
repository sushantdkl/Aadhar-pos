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
  Database,
  Menu,
  CreditCard
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
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showGraceModal, setShowGraceModal] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [showBackupViewer, setShowBackupViewer] = useState(false);
  const [cloudBackupEnabled, setCloudBackupEnabled] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [extensionDays, setExtensionDays] = useState(30);
  const [graceDays, setGraceDays] = useState(5);
  const [customExpiryDate, setCustomExpiryDate] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    days_to_add: 30,
    payment_method: 'bank_transfer',
    payment_id: '',
    notes: ''
  });

  // Generate unique transaction ID
  const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `TXN-${timestamp}-${random}`;
  };

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
        setPayments(data.payments || []);
        setGraceDays(data.restaurant.grace_period_days || 5);
        setCloudBackupEnabled(data.restaurant.cloud_backup_enabled || false);
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
        body: JSON.stringify({ action })
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
        ? 'Enable Cloud Backup for this restaurant? This will allow them to backup to cloud storage.' 
        : 'Disable Cloud Backup? This will remove their ability to backup to cloud.'
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

  const handleMakePayment = async () => {
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(`/api/restaurants-firebase/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'make_payment',
          ...paymentData,
          amount: parseFloat(paymentData.amount),
          days_to_add: parseInt(paymentData.days_to_add) || 0
        })
      });

      if (res.ok) {
        alert('Payment recorded successfully!');
        setShowPaymentModal(false);
        setPaymentData({
          amount: '',
          days_to_add: 30,
          payment_method: 'bank_transfer',
          payment_id: '',
          notes: ''
        });
        fetchRestaurant();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to record payment');
    } finally {
      setProcessing(false);
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

  const daysLeft = restaurant.expiry_date ? getDaysRemaining(restaurant.expiry_date) : null;
  const isExpired = daysLeft !== null && daysLeft < 0;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage="restaurants" user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
          <div className="mb-6">
            <button
              onClick={() => router.push('/dashboard/restaurants')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Restaurants
            </button>

            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
                <p className="text-gray-600 mt-1">{restaurant.owner_name}</p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Restaurant POS
                </span>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                <button
                  onClick={() => {
                    setPaymentData({
                      amount: '',
                      days_to_add: 30,
                      payment_method: 'bank_transfer',
                      payment_id: generateTransactionId(),
                      notes: ''
                    });
                    setShowPaymentModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Make Payment</span>
                </button>
                <button
                  onClick={() => setShowBackupViewer(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Database className="w-4 h-4" />
                  <span className="text-sm">View Backups</span>
                </button>
                <button
                  onClick={() => setShowExtendModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add/Remove Days</span>
                </button>
                <button
                  onClick={() => setShowCustomDateModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Set Date</span>
                </button>
                <button
                  onClick={() => setShowGraceModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Grace Period</span>
                </button>
                <button
                  onClick={handleToggleCloudBackup}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    cloudBackupEnabled
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span className="text-sm">
                  {cloudBackupEnabled ? 'Cloud Backup ON' : 'Cloud Backup OFF'}
                  </span>
                </button>
                <button
                  onClick={handleToggleStatus}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                    restaurant.status === 'active'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {restaurant.status === 'active' ? (
                    <>
                      <Ban className="w-4 h-4" />
                      <span className="text-sm">Suspend</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      <span className="text-sm">Activate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        {/* License Status Card */}
        <div className={`bg-white rounded-lg shadow-sm border-2 p-6 mb-6 ${
          isExpired ? 'border-red-300' :
          isExpiringSoon ? 'border-yellow-300' :
          'border-green-300'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">License Status</h2>
            {restaurant.license_status === 'active' && !isExpired ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500" />
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">License Key</p>
              <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                {restaurant.license_key || 'N/A'}
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Plan Type</p>
              <p className="font-semibold text-gray-900">{restaurant.plan_type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Expiry Date</p>
              <p className="font-semibold text-gray-900">
                {restaurant.expiry_date ? formatDate(restaurant.expiry_date) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Days Remaining</p>
              <p className={`font-bold text-lg ${
                isExpired ? 'text-red-600' :
                isExpiringSoon ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {daysLeft !== null ? (
                  daysLeft > 0 ? `${daysLeft} days` : `${Math.abs(daysLeft)} days ago`
                ) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Grace Period</p>
              <p className="font-semibold text-gray-900">{restaurant.grace_period_days || 5} days</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Last Verified</p>
              <p className="font-semibold text-gray-900">
                {restaurant.last_verified ? formatDate(restaurant.last_verified) : 'Never'}
              </p>
            </div>
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurant Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="font-semibold text-gray-900">{restaurant.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold text-gray-900">{restaurant.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">City</p>
              <p className="font-semibold text-gray-900">{restaurant.city || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">State</p>
              <p className="font-semibold text-gray-900">{restaurant.state || 'N/A'}</p>
            </div>
            {restaurant.pan_number && (
              <div>
                <p className="text-sm text-gray-600 mb-1">PAN Number</p>
                <p className="font-semibold text-gray-900">{restaurant.pan_number}</p>
              </div>
            )}
            {restaurant.gst_number && (
              <div>
                <p className="text-sm text-gray-600 mb-1">GST Number</p>
                <p className="font-semibold text-gray-900">{restaurant.gst_number}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment History */}

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Added</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(payment.payment_date || payment.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      NPR {payment.amount?.toLocaleString() || '0'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {payment.days_added || payment.plan_duration ? `${payment.days_added || (payment.plan_duration * 30)} days` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                      {payment.payment_method || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {payment.payment_id || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.payment_status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.payment_status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {payment.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && (
              <p className="text-center text-gray-600 py-8">No payment history</p>
            )}
          </div>
        </div>
      </div>

      {/* Extend Expiry Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add/Remove Days</h3>
            <p className="text-gray-600 mb-4">
              Current expiry: {restaurant.expiry_date ? formatDate(restaurant.expiry_date) : 'N/A'}
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
                New expiry date: {restaurant.expiry_date && extensionDays ? 
                  new Date(new Date(restaurant.expiry_date).getTime() + extensionDays * 24 * 60 * 60 * 1000)
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
              Current expiry: {restaurant.expiry_date ? formatDate(restaurant.expiry_date) : 'N/A'}
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
              Current grace period: {restaurant.grace_period_days || 5} days
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Record Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount (NPR)
                </label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="5000"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days to Add to License
                </label>
                <input
                  type="number"
                  value={paymentData.days_to_add}
                  onChange={(e) => setPaymentData({ ...paymentData, days_to_add: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="30"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentData.payment_method}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="esewa">eSewa</option>
                  <option value="khalti">Khalti</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID (Auto-generated)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={paymentData.payment_id}
                    readOnly
                    className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(paymentData.payment_id);
                      alert('Transaction ID copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Copy Transaction ID"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  rows="2"
                  placeholder="Payment for monthly subscription"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentData({
                    amount: '',
                    days_to_add: 30,
                    payment_method: 'bank_transfer',
                    payment_id: '',
                    notes: ''
                  });
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMakePayment}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Record Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Viewer Modal */}
      {showBackupViewer && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowBackupViewer(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Cloud Backups - {restaurant.name}</h3>
              <button
                onClick={() => setShowBackupViewer(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <BackupViewer 
                licenseKey={restaurant.license_key} 
                restaurantName={restaurant.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
