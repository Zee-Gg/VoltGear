'use client'

import { useEffect, useState } from 'react'
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Loader2, 
  ChevronRight,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  Eye
} from 'lucide-react'
import api from '../../lib/api'
import Link from 'next/link'

interface Order {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  paymentStatus: string
  user: { name: string, email: string }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/orders/admin/all')
      setOrders(response.data.data)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      setUpdatingId(id)
      await api.patch(`/orders/admin/${id}/status`, { status })
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statusIcons: Record<string, unknown> = {
    'PENDING': Clock,
    'PROCESSING': Package,
    'SHIPPED': Truck,
    'DELIVERED': CheckCircle2,
    'CANCELLED': XCircle
  }

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'PROCESSING': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'SHIPPED': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    'DELIVERED': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'CANCELLED': 'bg-red-500/10 text-red-500 border-red-500/20',
  }

  if (loading && orders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
          <ShoppingBag size={36} className="text-indigo-400" /> Order <span className="text-gradient">Fulfillment</span>
        </h1>
        <p className="text-slate-500 font-medium">Track and update customer orders across the platform.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search orders by ID, name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
          />
        </div>
        <button className="bg-slate-900 border border-white/5 text-slate-400 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/5 transition-all">
          <Filter size={20} /> All Statuses
        </button>
      </div>

      {/* Orders Table */}
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Order & Customer</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Total</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Payment</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => {
                const StatusIcon = statusIcons[order.status] || Clock
                return (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">#{order.id.slice(-6).toUpperCase()}</span>
                        <span className="text-slate-400 text-xs font-medium">{order.user.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-slate-400 text-sm font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-white font-black text-lg">${order.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${order.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="relative inline-block">
                        {updatingId === order.id ? (
                          <Loader2 size={18} className="animate-spin text-indigo-400" />
                        ) : (
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className={`appearance-none bg-transparent pl-8 pr-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border outline-none cursor-pointer ${statusColors[order.status]}`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        )}
                        <StatusIcon className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${statusColors[order.status].split(' ')[1]}`} size={14} />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Link 
                        href={`/orders/${order.id}`}
                        target="_blank"
                        className="w-10 h-10 rounded-xl bg-white/5 text-slate-500 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-white/5 shadow-lg"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
