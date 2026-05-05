'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '../lib/api'
import { 
  User, 
  ShoppingBag, 
  Lock, 
  Settings, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  Package, 
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react'

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'security'>('overview')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  
  // Security form state
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [updatingPassword, setUpdatingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      const fetchOrders = async () => {
        try {
          setOrdersLoading(true)
          const response = await api.get('/orders/my-orders')
          setOrders(response.data.data)
        } catch (err) {
          console.error('Failed to fetch orders:', err)
        } finally {
          setOrdersLoading(false)
        }
      }
      fetchOrders()
    }
  }, [isAuthenticated, activeTab])

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    try {
      setUpdatingPassword(true)
      setPasswordMessage(null)
      await api.patch('/auth/update-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      setPasswordMessage({ type: 'success', text: 'Password updated successfully' })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: unknown) {
      const error = err as any
      setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' })
    } finally {
      setUpdatingPassword(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'PROCESSING': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'SHIPPED': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    'DELIVERED': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'CANCELLED': 'bg-red-500/10 text-red-500 border-red-500/20',
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Ambient Glows */}
      <div className="ambient-glow top-0 left-0 opacity-20"></div>
      <div className="ambient-glow bottom-0 right-0 opacity-20"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-card rounded-3xl p-6 flex flex-col items-center text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl font-black mb-4 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{user.email}</p>
              <div className="w-full h-[1px] bg-white/5 mb-6"></div>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 font-bold text-sm transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

            <nav className="glass rounded-3xl p-3 flex flex-col gap-1 border border-white/5 animate-fade-in-up delay-100">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <Settings size={18} /> Overview
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <ShoppingBag size={18} /> My Orders
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'security' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <Lock size={18} /> Security
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="animate-fade-in-up space-y-6">
                <div className="glass-card rounded-3xl p-8 border border-white/5">
                  <h2 className="text-2xl font-black text-white mb-8 tracking-tight">Account <span className="text-gradient">Overview</span></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Full Name</p>
                      <p className="text-white text-lg font-bold">{user.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Email Address</p>
                      <p className="text-white text-lg font-bold">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Role</p>
                      <p className="text-emerald-400 text-lg font-bold flex items-center gap-2">
                        <CheckCircle2 size={18} /> {user.role}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Customer Since</p>
                      <p className="text-white text-lg font-bold">{new Date().getFullYear()} Member</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass p-6 rounded-3xl border border-white/5">
                    <Package className="text-indigo-400 mb-4" size={24} />
                    <h4 className="text-white font-bold mb-1">Total Orders</h4>
                    <p className="text-3xl font-black text-white">--</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-white/5">
                    <Calendar className="text-indigo-400 mb-4" size={24} />
                    <h4 className="text-white font-bold mb-1">Next Delivery</h4>
                    <p className="text-lg font-bold text-slate-400">Scheduled</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-white/5">
                    <User className="text-indigo-400 mb-4" size={24} />
                    <h4 className="text-white font-bold mb-1">Loyalty Points</h4>
                    <p className="text-3xl font-black text-gradient">250</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-fade-in-up space-y-6">
                <div className="glass-card rounded-3xl p-8 border border-white/5">
                  <h2 className="text-2xl font-black text-white mb-8 tracking-tight">Order <span className="text-gradient">History</span></h2>
                  
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag size={48} className="text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">No orders found.</p>
                      <Link href="/products" className="text-indigo-400 hover:text-indigo-300 mt-2 block font-bold">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Link 
                          key={order.id} 
                          href={`/orders/${order.id}`}
                          className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl glass border border-white/5 hover:border-white/20 transition-all group"
                        >
                          <div className="flex flex-col gap-1 mb-4 sm:mb-0">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Order ID: #{order.id.slice(-6).toUpperCase()}</span>
                            <span className="text-white font-bold text-lg">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          
                          <div className="flex items-center gap-6 w-full sm:w-auto justify-between">
                            <div className="flex flex-col items-end">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${statusColors[order.status] || statusColors.PENDING}`}>
                                {order.status}
                              </span>
                              <span className="text-white font-black text-xl mt-1">${order.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                              <ChevronRight size={20} />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animate-fade-in-up">
                <div className="glass-card rounded-3xl p-8 border border-white/5 max-w-2xl">
                  <h2 className="text-2xl font-black text-white mb-8 tracking-tight">Security <span className="text-gradient">Settings</span></h2>
                  
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Current Password</label>
                      <input 
                        type="password" 
                        required
                        value={passwords.currentPassword}
                        onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
                        className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">New Password</label>
                      <input 
                        type="password" 
                        required
                        value={passwords.newPassword}
                        onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                        className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        required
                        value={passwords.confirmPassword}
                        onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                        className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                      />
                    </div>

                    {passwordMessage && (
                      <div className={`p-4 rounded-xl flex items-center gap-3 ${passwordMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {passwordMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm font-medium">{passwordMessage.text}</span>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={updatingPassword}
                      className="w-full sm:w-auto bg-gradient-primary text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {updatingPassword ? <Loader2 className="animate-spin" /> : 'Update Password'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
