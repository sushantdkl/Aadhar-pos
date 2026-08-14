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
  Database,
  CreditCard
} from 'lucide-react';
import { formatDate, formatCurrency, getDaysRemaining } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import BackupViewer from '@/components/backup-viewer';

export default function ShopDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shop, setShop] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showGraceModal, setShowGraceModal] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [showBackupViewer, setShowBackupViewer] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cloudBackupEnabled, setCloudBackupEnabled] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [extensionDays, setExtensionDays] = useState(30);
  const [graceDays, setGraceDays] = useState(5);
  const [customExpiryDate, setCustomExpiryDate] = useState('');
  const [processing, setProcessing] = useState(false);
  const [newLicenseData, setNewLicenseData] = useState({
    plan_type: 'monthly',
    plan_duration: 1
  });
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
      fetchShop();
    }
  }, [params.id]);

  const fetchShop = async () => {
    try {
      const res = await fetch(`/api/shops-firebase/${params.id}`);
      const data = await res.json();
      
      if (data.error) {
        console.error('API Error:', data.error);
        alert('Failed to load shop: ' + data.error);
        return;
      }
      
      if (data.shop) {
        setShop(data.shop);
        setLicenses(data.licenses || []);
        if (data.licenses && data.licenses.length > 0) {
          setSelectedLicense(data.licenses[0]);
          setGraceDays(data.licenses[0].grace_period_days || 5);
          setCloudBackupEnabled(data.licenses[0].cloud_backup_enabled || false);
        }
      }

      // Fetch payment history
      const paymentsRes = await fetch(`/api/payments-firebase?shop_id=${params.id}`);
      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch shop:', error);
      alert('Failed to load shop details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLicense = async () => {
    setProcessing(true);
    try {
      // Generate license key for retail: RETAIL-YYYY-XXXXXXXX-YYYYYYYY
      const year = new Date().getFullYear();
      const random1 = Math.random().toString(36).substring(2, 10);
      const random2 = Math.random().toString(36).substring(2, 10).toUpperCase();
      const licenseKey = `RETAIL-${year}-${random1}-${random2}`;

      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + parseInt(newLicenseData.plan_duration));
      
      const res = await fetch('/api/licenses-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: licenseKey,
          business_id: params.id,
          business_type: 'retail',
          plan_type: newLicenseData.plan_type,
          plan_duration: parseInt(newLicenseData.plan_duration),
          expiry_date: expiryDate.toISOString().split('T')[0],
          grace_period_days: 5,
          status: 'active'
        })
      });

      if (res.ok) {
        alert('License created successfully!');
        setShowLicenseModal(false);
        fetchShop();
      } else {
        const error = await res.json();
        alert('Failed to create license: ' + error.error);
      }
    } catch (error) {
      alert('Failed to create license');
    } finally {
      setProcessing(false);
    }
  };

  const handleExtendExpiry = async () => {
    if (!selectedLicense) return;
    
    setProcessing(true);
    try {
      const res = await fetch(`/api/licenses-firebase/${selectedLicense.id}`, {
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
        fetchShop();
      }
    } catch (error) {
      alert('Failed to extend expiry');
    } finally {
      setProcessing(false);
    }
  };

  const handleExtendGrace = async () => {
    if (!selectedLicense) return;
    
    setProcessing(true);
    try {
      const res = await fetch(`/api/licenses-firebase/${selectedLicense.id}`, {
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
        fetchShop();
      }
    } catch (error) {
      alert('Failed to update grace period');
    } finally {
      setProcessing(false);
    }
  };

  const handleSetCustomDate = async () => {
    if (!selectedLicense || !customExpiryDate) {
      alert('Please select a date');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(`/api/licenses-firebase/${selectedLicense.id}`, {
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
        fetchShop();
      }
    } catch (error) {
      alert('Failed to update expiry date');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleStatus = async () => {
    const action = shop.status === 'active' ? 'suspend' : 'activate';
    const confirmed = confirm(`Are you sure you want to ${action} this shop?`);
    
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/shops-firebase/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: action === 'suspend' ? 'suspended' : 'active'
        })
      });

      if (res.ok) {
        alert(`Shop ${action}d successfully`);
        fetchShop();
      }
    } catch (error) {
      alert(`Failed to ${action} shop`);
    }
  };

  const handleToggleCloudBackup = async () => {
    const newState = !cloudBackupEnabled;
    const confirmed = confirm(
      newState 
        ? 'Enable Cloud Backup for this shop? This is a premium feature.'
        : 'Disable Cloud Backup for this shop?'
    );
    
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/licenses-firebase/${activeLicense.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cloud_backup_enabled: newState,
          cloud_backup_activated_at: newState ? new Date().toISOString() : null
        })
      });

      if (res.ok) {
        setCloudBackupEnabled(newState);
        alert(`Cloud Backup ${newState ? 'enabled' : 'disabled'} successfully`);
        fetchShop();
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

    if (!activeLicense) {
      alert('No active license found');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(`/api/licenses-firebase/${activeLicense.id}`, {
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
        fetchShop();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to record payment');
      }
    } catch (error) {
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

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Shop not found</p>
      </div>
    );
  }

  const activeLicense = selectedLicense || licenses[0];
  const daysLeft = activeLicense?.expiry_date ? getDaysRemaining(activeLicense.expiry_date) : null;
  const isExpired = daysLeft !== null && daysLeft < 0;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage="shops" user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
            onClick={() => router.push('/dashboard/businesses')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Businesses
          </button>

          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
              <p className="text-gray-600 mt-1">{shop.owner_name}</p>
              <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                Retail Shop
              </span>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
              {activeLicense && (
                <>
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
                    <span className="text-sm">{cloudBackupEnabled ? 'Cloud Backup ON' : 'Cloud Backup OFF'}</span>
                  </button>
                </>
              )}
              <button
                onClick={handleToggleStatus}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                  shop.status === 'active'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {shop.status === 'active' ? (
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

        {/* Licenses Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Licenses</h2>
            <button
              onClick={() => setShowLicenseModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Create License
            </button>
          </div>

          {licenses.length > 0 ? (
            <div className="space-y-4">
              {licenses.map((license) => {
                const licDaysLeft = getDaysRemaining(license.expiry_date);
                const licExpired = licDaysLeft < 0;
                const licExpiringSoon = licDaysLeft <= 7 && licDaysLeft >= 0;
                
                return (
                  <div
                    key={license.id}
                    onClick={() => setSelectedLicense(license)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedLicense?.id === license.id
                        ? 'border-blue-500 bg-blue-50'
                        : licExpired
                        ? 'border-red-300 hover:border-red-400'
                        : licExpiringSoon
                        ? 'border-yellow-300 hover:border-yellow-400'
                        : 'border-green-300 hover:border-green-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <code className="text-sm font-mono px-2 py-1 bg-gray-100 rounded">
                            {license.license_key || license.id}
                          </code>
                          <span className="text-sm font-semibold text-gray-700">
                            {license.plan_type}
                          </span>
                          {licExpired ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Expiry:</span>
                            <span className="ml-2 font-semibold">
                              {formatDate(license.expiry_date)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Remaining:</span>
                            <span className={`ml-2 font-bold ${
                              licExpired ? 'text-red-600' :
                              licExpiringSoon ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {licDaysLeft > 0 ? `${licDaysLeft} days` : `${Math.abs(licDaysLeft)} days ago`}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Grace:</span>
                            <span className="ml-2 font-semibold">
                              {license.grace_period_days || 5} days
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Key className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No licenses created yet</p>
              <button
                onClick={() => setShowLicenseModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First License
              </button>
            </div>
          )}
        </div>

        {/* Shop Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Shop Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="font-semibold text-gray-900">{shop.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold text-gray-900">{shop.email || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p className="font-semibold text-gray-900">{shop.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                shop.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {shop.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Created</p>
              <p className="font-semibold text-gray-900">
                {shop.created_at ? formatDate(shop.created_at) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
            {payments.length > 0 && (
              <span className="text-sm text-gray-600">{payments.length} transaction(s)</span>
            )}
          </div>

          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Added</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(payment.payment_date || payment.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        NPR {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {payment.days_added || (payment.plan_duration ? payment.plan_duration * 30 : 0)} days
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {payment.payment_method ? 
                          payment.payment_method.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ') 
                          : 'N/A'
                        }
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">
                        {payment.payment_id || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.payment_status || 'completed'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {payment.notes ? (
                          <span title={payment.notes}>
                            {payment.notes.length > 30 ? `${payment.notes.substring(0, 30)}...` : payment.notes}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">No payment history yet</p>
              <p className="text-sm text-gray-500">Payments will appear here once recorded</p>
            </div>
          )}
        </div>
      </div>

      {/* Create License Modal */}
      {showLicenseModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Create New License</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Type
                </label>
                <select
                  value={newLicenseData.plan_type}
                  onChange={(e) => setNewLicenseData({...newLicenseData, plan_type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Months)
                </label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  value={newLicenseData.plan_duration}
                  onChange={(e) => setNewLicenseData({...newLicenseData, plan_duration: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  License will be valid for {newLicenseData.plan_duration} month(s) from today
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLicenseModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLicense}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? 'Creating...' : 'Create License'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Expiry Modal */}
      {showExtendModal && selectedLicense && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add/Remove Days</h3>
            <p className="text-gray-600 mb-4">
              Current expiry: {formatDate(selectedLicense.expiry_date)}
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
                  new Date(new Date(selectedLicense.expiry_date).getTime() + extensionDays * 24 * 60 * 60 * 1000)
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
      {showCustomDateModal && selectedLicense && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Set Custom Expiry Date</h3>
            <p className="text-gray-600 mb-4">
              Current expiry: {formatDate(selectedLicense.expiry_date)}
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
      {showGraceModal && selectedLicense && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Update Grace Period</h3>
            <p className="text-gray-600 mb-4">
              Current grace period: {selectedLicense.grace_period_days || 5} days
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
                <strong>Grace Period:</strong> Shop can continue operating for {graceDays} days after license expires.
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
      
      {/* Backup Viewer */}
      {showBackupViewer && activeLicense && (
        <BackupViewer
          licenseKey={activeLicense.license_key}
          shopName={shop.name}
          onClose={() => setShowBackupViewer(false)}
        />
      )}
      </div>
    </div>
  );
}
