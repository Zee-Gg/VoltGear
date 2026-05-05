'use client'

import { useEffect, useState } from 'react'
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Loader2, 
  Calendar, 
  Users, 
  Tag, 
  Percent,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import api from '../../lib/api'

interface Coupon {
  id: string
  code: string
  discountPercent: number
  maxUses: number
  usedCount: number
  expiresAt: string
  isActive: boolean
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: '',
    maxUses: '',
    expiresAt: ''
  })
  const [creating, setCreating] = useState(false)

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const response = await api.get('/coupons')
      setCoupons(response.data.data)
    } catch (err) {
      console.error('Failed to fetch coupons:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setCreating(true)
      const payload = {
        ...formData,
        discountPercent: parseFloat(formData.discountPercent),
        maxUses: parseInt(formData.maxUses),
        expiresAt: new Date(formData.expiresAt).toISOString()
      }
      const response = await api.post('/coupons', payload)
      setCoupons([response.data.data, ...coupons])
      setShowForm(false)
      setFormData({ code: '', discountPercent: '', maxUses: '', expiresAt: '' })
    } catch (err) {
      console.error('Failed to create coupon:', err)
      alert('Failed to create coupon. Check if code already exists.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return
    try {
      await api.delete(`/coupons/${id}`)
      setCoupons(coupons.filter(c => c.id !== id))
    } catch (err) {
      console.error('Failed to delete coupon:', err)
    }
  }

  if (loading && coupons.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            <Ticket size={36} className="text-indigo-400" /> Coupon <span className="text-gradient">Engine</span>
          </h1>
          <p className="text-slate-500 font-medium">Create and manage discount codes for marketing campaigns.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-primary text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:scale-[1.02] transition-all"
        >
          <Plus size={20} /> Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-xl rounded-3xl p-8 border border-white/10 animate-scale-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white">New Discount Coupon</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Coupon Code</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. VOLT20" 
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Discount (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      required
                      type="number" 
                      placeholder="20" 
                      value={formData.discountPercent}
                      onChange={e => setFormData({...formData, discountPercent: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Max Uses</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      required
                      type="number" 
                      placeholder="100" 
                      value={formData.maxUses}
                      onChange={e => setFormData({...formData, maxUses: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Expiry Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    required
                    type="date" 
                    value={formData.expiresAt}
                    onChange={e => setFormData({...formData, expiresAt: e.target.value})}
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner appearance-none" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={creating}
                className="w-full bg-gradient-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {creating ? <Loader2 className="animate-spin mx-auto" /> : 'Create Promotional Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Ticket size={120} />
            </div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-xl font-black text-xl tracking-widest border border-indigo-500/20">
                {coupon.code}
              </div>
              <button 
                onClick={() => handleDelete(coupon.id)}
                className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Discount</span>
                <span className="text-white font-black text-2xl">{coupon.discountPercent}% OFF</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Usage</span>
                <span className="text-slate-300 font-bold text-sm">{coupon.usedCount} / {coupon.maxUses} used</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary transition-all duration-1000" 
                  style={{ width: `${(coupon.usedCount / coupon.maxUses) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                  <Calendar size={14} /> Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${coupon.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {coupon.isActive ? <><CheckCircle2 size={12} /> Active</> : <><AlertCircle size={12} /> Expired</>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
