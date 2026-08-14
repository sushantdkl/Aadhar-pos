'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Store,
  Key,
  IndianRupee,
  LogOut,
  X,
  Building2,
  ShoppingBag,
  Package,
  Users,
  Mail,
  FileText,
  Briefcase
} from 'lucide-react';

export default function Sidebar({ activePage, user, sidebarOpen, setSidebarOpen }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/login');
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Image src="/LOGO_Icon_only.png" alt="Aadhar" width={32} height={32} className="w-8 h-8" />
            <h1 className="text-xl font-bold text-orange-600">Aadhar Admin</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activePage === 'dashboard'}
            onClick={() => router.push('/dashboard')}
          />
          <NavItem
            icon={Building2}
            label="Businesses"
            active={activePage === 'businesses'}
            onClick={() => router.push('/dashboard/businesses')}
          />
          <NavItem
            icon={Store}
            label="Restaurants"
            active={activePage === 'restaurants'}
            onClick={() => router.push('/dashboard/restaurants')}
          />
          <NavItem
            icon={ShoppingBag}
            label="Retail Shops"
            active={activePage === 'shops'}
            onClick={() => router.push('/dashboard/shops')}
          />
          <NavItem
            icon={Users}
            label="Leads"
            active={activePage === 'leads'}
            onClick={() => router.push('/dashboard/leads')}
          />
          <NavItem
            icon={Mail}
            label="Contact Requests"
            active={activePage === 'contacts'}
            onClick={() => router.push('/dashboard/contacts')}
          />
          <NavItem
            icon={Package}
            label="Master Products"
            active={activePage === 'products'}
            onClick={() => router.push('/dashboard/products')}
          />
          <NavItem
            icon={IndianRupee}
            label="Payments"
            active={activePage === 'payments'}
            onClick={() => router.push('/dashboard/payments')}
          />
          <NavItem
            icon={FileText}
            label="Blog Posts"
            active={activePage === 'blog'}
            onClick={() => router.push('/dashboard/blog')}
          />
          <NavItem
            icon={Briefcase}
            label="Careers"
            active={activePage === 'careers'}
            onClick={() => router.push('/dashboard/careers')}
          />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          {user && (
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-orange-50 text-orange-600'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
