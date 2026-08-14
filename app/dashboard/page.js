'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Store,
  Key,
  IndianRupee,
  Building2,
  ShoppingBag,
  Users,
  Mail
} from 'lucide-react';
import { formatCurrency, formatDate, getDaysRemaining } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentBusinesses, setRecentBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard-firebase');
      const data = await res.json();
      setStats(data.stats);
      setRecentBusinesses(data.recentBusinesses);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/login');
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
      <Sidebar activePage="dashboard" user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              icon={Building2}
              label="Total Restaurants"
              value={stats?.totalRestaurants || 0}
              color="orange"
            />
            <StatCard
              icon={ShoppingBag}
              label="Total Retail Shops"
              value={stats?.totalShops || 0}
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Total Leads"
              value={stats?.totalLeads || 0}
              color="purple"
            />
            <StatCard
              icon={Mail}
              label="Contact Requests"
              value={stats?.totalContacts || 0}
              color="cyan"
            />
            <StatCard
              icon={IndianRupee}
              label="Total Revenue"
              value={formatCurrency(stats?.totalRevenue || 0)}
              color="green"
            />
          </div>

          {/* Recent Businesses */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Businesses</h3>
              <p className="text-sm text-gray-600 mt-1">Latest restaurants and retail shops</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Key</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentBusinesses.map((business) => {
                    const daysLeft = business.expiry_date ? getDaysRemaining(business.expiry_date) : null;
                    const isActive = business.license_status === 'active' && daysLeft !== null && daysLeft > 0;
                    const BusinessIcon = business.type === 'restaurant' ? Building2 : ShoppingBag;
                    return (
                      <tr key={business.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{business.name}</div>
                          <div className="text-sm text-gray-600">{business.contact_number || business.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <BusinessIcon className={`w-4 h-4 ${business.type === 'restaurant' ? 'text-orange-600' : 'text-blue-600'}`} />
                            <span className="text-sm capitalize text-gray-900">{business.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{business.owner_name}</td>
                        <td className="px-6 py-4">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {business.license_key || 'No license'}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          {isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Expired
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {business.expiry_date ? (
                            <>
                              {formatDate(business.expiry_date)}
                              {daysLeft !== null && (
                                <div className={`text-xs mt-1 ${daysLeft <= 7 ? 'text-red-600' : 'text-gray-600'}`}>
                                  {daysLeft > 0 ? `${daysLeft} days left` : `Expired ${Math.abs(daysLeft)} days ago`}
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    cyan: 'bg-cyan-100 text-cyan-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
