import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, LayoutDashboard, Package, LogOut, ShieldAlert, Leaf, ArrowLeft, MessageSquareQuote } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import AdminLogin from '@/components/admin/AdminLogin';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel';
import ProductManager from '@/components/admin/ProductManager';
import TestimonialManager from '@/components/admin/TestimonialManager';

export default function Admin() {
  const { isAuthenticated, isLoadingAuth, isAdmin, user, logout } = useAuth();
  const [tab, setTab] = useState('analytics');

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7 text-orange-600" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Access Restricted</h1>
          <p className="text-slate-600 text-sm mb-6">
            {user?.email} is signed in, but this dashboard is only available to the site administrator.
          </p>
          <Button onClick={logout} variant="outline" className="rounded-xl">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 leading-tight truncate">Pascaqueen Admin</p>
              <p className="text-xs text-gray-400 leading-tight truncate hidden sm:block">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 items-center gap-1.5 mr-1 hidden sm:flex"
            >
              <ArrowLeft className="w-4 h-4" /> View Site
            </Link>
            <Link
              to="/"
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 sm:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Button onClick={logout} variant="outline" size="sm" className="rounded-xl gap-2">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-2 mb-6 sm:mb-8 bg-white p-1.5 rounded-xl border border-gray-100 w-full sm:w-fit overflow-x-auto">
          <button
            onClick={() => setTab('analytics')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none whitespace-nowrap ${
              tab === 'analytics' ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Analytics
          </button>
          <button
            onClick={() => setTab('products')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none whitespace-nowrap ${
              tab === 'products' ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Package className="w-4 h-4" /> Products
          </button>
          <button
            onClick={() => setTab('testimonials')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none whitespace-nowrap ${
              tab === 'testimonials' ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" /> Testimonials
          </button>
        </div>

        {tab === 'analytics' && <AnalyticsPanel />}
        {tab === 'products' && <ProductManager />}
        {tab === 'testimonials' && <TestimonialManager />}
      </div>
    </div>
  );
}
