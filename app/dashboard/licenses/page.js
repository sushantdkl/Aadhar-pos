'use client';

import { useEffect, useState } from 'react';
import { Key, Search, Calendar, CheckCircle, XCircle, Clock, AlertTriangle, Building2, Store, Filter } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { formatDate } from '@/lib/utils';

export default function LicensesPage() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [licenses, setLicenses] = useState([]);
  const [filteredLicenses, setFilteredLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [businessTypeFilter, setBusinessTypeFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (!token || !userData) {
      window.location.href = '/login';
      return;
    }

    setUser(JSON.parse(userData));
    fetchLicenses();
  }, []);

  useEffect(() => {
    filterLicenses();
  }, [licenses, searchTerm, statusFilter, businessTypeFilter]);

  const fetchLicenses = async () => {
    try {
      const res = await fetch('/api/licenses-firebase');
      if (res.ok) {
        const data = await res.json();
        setLicenses(data.licenses || []);
      }
    } catch (error) {
      console.error('Error fetching licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLicenses = () => {
    let filtered = [...licenses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(license =>
        license.license_key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.business_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(license => license.status === statusFilter);
    }

    // Business type filter
    if (businessTypeFilter !== 'all') {
      filtered = filtered.filter(license => license.business_type === businessTypeFilter);
    }

    setFilteredLicenses(filtered);
  };

  const getStatusInfo = (license) => {
    const now = new Date();
    const expiryDate = new Date(license.expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    if (license.status === 'expired') {
      return { color: 'text-red-600 bg-red-50', icon: XCircle, text: 'Expired' };
    } else if (daysUntilExpiry <= 0) {
      return { color: 'text-red-600 bg-red-50', icon: XCircle, text: 'Expired' };
    } else if (daysUntilExpiry <= 7) {
      return { color: 'text-orange-600 bg-orange-50', icon: AlertTriangle, text: `${daysUntilExpiry}d left` };
    } else if (license.status === 'active') {
      return { color: 'text-green-600 bg-green-50', icon: CheckCircle, text: 'Active' };
    } else {
      return { color: 'text-gray-600 bg-gray-50', icon: Clock, text: 'Inactive' };
    }
  };

  const stats = {
    total: licenses.length,
    active: licenses.filter(l => l.status === 'active').length,
    expired: licenses.filter(l => l.status === 'expired').length,
    expiring_soon: licenses.filter(l => {
      const daysLeft = Math.ceil((new Date(l.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
      return daysLeft > 0 && daysLeft <= 7;
    }).length,
    restaurants: licenses.filter(l => l.business_type === 'restaurant').length,
    retail: licenses.filter(l => l.business_type === 'retail').length
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
      <Sidebar activePage="licenses" user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">License Management</h1>
              <p className="text-gray-600 text-sm mt-1">Manage all system licenses</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <StatCard icon={Key} label="Total Licenses" value={stats.total} color="blue" />
            <StatCard icon={CheckCircle} label="Active" value={stats.active} color="green" />
            <StatCard icon={XCircle} label="Expired" value={stats.expired} color="red" />
            <StatCard icon={AlertTriangle} label="Expiring Soon" value={stats.expiring_soon} color="orange" />
            <StatCard icon={Building2} label="Restaurants" value={stats.restaurants} color="purple" />
            <StatCard icon={Store} label="Retail Shops" value={stats.retail} color="indigo" />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search license key or business ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  <option value="expired">Expired</option>
                  <option value="inactive">Inactive</option>
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

          {/* Licenses Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">License Key</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Business Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Expiry Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Grace Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLicenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No licenses found
                      </td>
                    </tr>
                  ) : (
                    filteredLicenses.map((license) => {
                      const statusInfo = getStatusInfo(license);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <tr key={license.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-mono text-sm font-semibold text-gray-900">{license.license_key}</div>
                            <div className="text-xs text-gray-500 mt-1">ID: {license.business_id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                              license.business_type === 'restaurant' 
                                ? 'bg-orange-50 text-orange-600' 
                                : 'bg-blue-50 text-blue-600'
                            }`}>
                              {license.business_type === 'restaurant' ? <Building2 className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                              {license.business_type === 'restaurant' ? 'Restaurant' : 'Retail'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 capitalize">{license.plan_type}</div>
                            <div className="text-xs text-gray-500">{license.plan_duration} month(s)</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {formatDate(license.start_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {formatDate(license.expiry_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {statusInfo.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {license.grace_period_days} days
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

function StatCard({ icon: Icon, label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
