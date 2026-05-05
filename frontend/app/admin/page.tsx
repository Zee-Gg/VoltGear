'use client'

import { useEffect, useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  ChevronRight
} from 'lucide-react'
import api from '../lib/api'
import Link from 'next/link'

interface DashboardStats {
  totalRevenue: number
  ordersCount: number
  usersCount: number
  productsCount: number
  recentOrders: unknown[]
  salesByMonth: unknown[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await api.get('/dashboard/stats')
        setStats(response.data.data)
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  const cards = [
    { name: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12.5%', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Total Orders', value: stats.ordersCount.toString(), icon: ShoppingBag, trend: '+8.2%', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Total Users', value: stats.usersCount.toString(), icon: Users, trend: '+14.1%', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'Active Products', value: stats.productsCount.toString(), icon: Package, trend: '+2.4%', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ]

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight">Dashboard <span className="text-gradient">Overview</span></h1>
        <p className="text-slate-500 font-medium">Welcome back, Admin. Here&apos;s what&apos;s happening with VoltGear today.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
            <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500`}>
              <card.icon size={120} />
            </div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center ${card.color} shadow-lg`}>
                <card.icon size={28} />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-black bg-emerald-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} /> {card.trend}
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{card.name}</p>
              <h3 className="text-3xl font-black text-white">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <TrendingUp className="text-indigo-400" /> Sales Trend
            </h2>
            <div className="flex gap-2">
              <button className="px-4 py-1 rounded-lg bg-white/5 text-white text-xs font-bold border border-white/10">Weekly</button>
              <button className="px-4 py-1 rounded-lg bg-indigo-500 text-white text-xs font-bold">Monthly</button>
            </div>
          </div>
          <div className="h-64 w-full flex items-end justify-between gap-2 px-4">
            {[40, 60, 45, 90, 65, 80, 100, 70, 85, 95, 110, 120].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div 
                  className="w-full bg-gradient-primary rounded-t-lg transition-all duration-1000 group-hover:opacity-80"
                  style={{ height: `${height}%`, animationDelay: `${i * 100}ms` }}
                ></div>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">M{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-1 glass-card rounded-3xl p-8 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-indigo-400 hover:text-indigo-300 text-xs font-black uppercase tracking-widest flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-6">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white font-bold group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                    {order.user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">{order.user.name}</span>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">#{order.id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-sm">${order.totalAmount.toLocaleString()}</p>
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
