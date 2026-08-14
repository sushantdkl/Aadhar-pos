'use client';

import { useEffect, useState } from 'react';
import { IndianRupee, Search, Calendar, CreditCard, Building2, Store, Filter, TrendingUp, DollarSign } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { formatDate } from '@/lib/utils';

export default function PaymentsPage() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [businessTypeFilter, setBusinessTypeFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (!token || !userData) {
      window.location.href = '/login';
      return;
    }

    setUser(JSON.parse(userData));
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, methodFilter, businessTypeFilter]);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments-firebase');
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.license_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.shop_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.restaurant_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Payment method filter
    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.payment_method === methodFilter);
    }

    // Business type filter
    if (businessTypeFilter !== 'all') {
      if (businessTypeFilter === 'restaurant') {
        filtered = filtered.filter(payment => payment.restaurant_id);
      } else {
        filtered = filtered.filter(payment => payment.shop_id);
      }
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));

    setFilteredPayments(filtered);
  };

  const stats = {
    total: payments.length,
    total_amount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    this_month: payments.filter(p => {
      const paymentDate = new Date(p.payment_date);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    }).length,
    this_month_amount: payments
      .filter(p => {
        const paymentDate = new Date(p.payment_date);
        const now = new Date();
        return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0),
    restaurants: payments.filter(p => p.restaurant_id).length,
    retail: payments.filter(p => p.shop_id).length
  };

  const getPaymentMethodBadge = (method) => {
    const methods = {
      cash: { color: 'bg-green-50 text-green-600', label: 'Cash' },
      upi: { color: 'bg-purple-50 text-purple-600', label: 'UPI' },
      card: { color: 'bg-blue-50 text-blue-600', label: 'Card' },
      bank_transfer: { color: 'bg-indigo-50 text-indigo-600', label: 'Bank Transfer' },
      other: { color: 'bg-gray-50 text-gray-600', label: 'Other' }
    };
    return methods[method] || methods.other;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activePage="payments" user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Records</h1>
              <p className="text-gray-600 text-sm mt-1">Track all license payments and renewals</p>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Payments</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <IndianRupee className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.total_amount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.this_month}</p>
                  <p className="text-xs text-green-600 mt-1">₹{stats.this_month_amount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">By Business</p>
                  <p className="text-sm text-gray-900 mt-2">
                    <span className="font-semibold">{stats.restaurants}</span> Restaurants
                  </p>
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{stats.retail}</span> Retail Shops
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search transaction ID, license, or business ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Payment Method Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="all">All Methods</option>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Business Type Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={businessTypeFilter}
                  onChange={(e) => setBusinessTypeFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="all">All Types</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="retail">Retail</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">License</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Days Added</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => {
                      const methodBadge = getPaymentMethodBadge(payment.payment_method);
                      const businessType = payment.restaurant_id ? 'restaurant' : 'retail';
                      const businessId = payment.restaurant_id || payment.shop_id;

                      return (
                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-mono text-sm font-semibold text-gray-900">{payment.transaction_id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {businessType === 'restaurant' ? (
                                <Building2 className="w-4 h-4 text-orange-600" />
                              ) : (
                                <Store className="w-4 h-4 text-blue-600" />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900 capitalize">{businessType}</div>
                                <div className="text-xs text-gray-500 font-mono">{businessId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-mono text-gray-600">{payment.license_id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-lg font-bold text-green-600">₹{payment.amount?.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${methodBadge.color}`}>
                              <CreditCard className="w-3.5 h-3.5" />
                              {methodBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">{payment.days_to_add} days</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {formatDate(payment.payment_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 max-w-xs truncate" title={payment.notes}>
                              {payment.notes || '-'}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
