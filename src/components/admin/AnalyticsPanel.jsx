import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Eye, ShoppingCart, Package, Wallet, Loader2, Radio } from 'lucide-react';

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function AnalyticsPanel() {
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  const loadStats = useCallback(async () => {
    const [{ count: products }, { data: orders }, { count: views }] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('page_views').select('*', { count: 'exact', head: true }),
    ]);

    setProductCount(products || 0);
    setOrderCount(orders?.length || 0);
    setRevenue((orders || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0));
    setRecentOrders(orders || []);
    setViewCount(views || 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStats();

    // Live updates: whenever a new order or page view lands, refresh instantly.
    const channel = supabase
      .channel('admin-analytics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadStats())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'page_views' }, () => {
        setViewCount((c) => c + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadStats]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Real-Time Analytics</h2>
          <p className="text-sm text-gray-500">Updates live as customers browse and check out.</p>
        </div>
        <span className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
          <Radio className="w-3.5 h-3.5 animate-pulse" /> Live
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Eye} label="Page Views" value={viewCount.toLocaleString()} accent="bg-blue-500" />
        <StatCard icon={ShoppingCart} label="Orders" value={orderCount.toLocaleString()} accent="bg-emerald-600" />
        <StatCard icon={Wallet} label="Revenue" value={`₦${revenue.toLocaleString()}`} accent="bg-amber-500" />
        <StatCard icon={Package} label="Products" value={productCount.toLocaleString()} accent="bg-purple-500" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No orders placed yet.</p>
        ) : (
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-gray-900 font-medium truncate">
                    {(order.items || []).map((it) => `${it.name} x${it.quantity}`).join(', ')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="text-emerald-700 font-semibold whitespace-nowrap">
                  ₦{Number(order.total || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
