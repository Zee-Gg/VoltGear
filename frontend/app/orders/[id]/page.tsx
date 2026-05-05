'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import api from '../../lib/api'
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  ChevronLeft, 
  MapPin, 
  CreditCard, 
  Calendar,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react'

export default function OrderDetailPage() {
  const { id } = useParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/orders/${id}`)
        setOrder(response.data.data)
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 px-4 text-center">
        <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Order Not Found</h1>
        <p className="text-slate-400 mb-8">We couldn&apos;t find the order you&apos;re looking for.</p>
        <Link href="/profile" className="bg-gradient-primary text-white px-8 py-3 rounded-full font-bold">
          Back to My Orders
        </Link>
      </div>
    )
  }

  const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']
  const currentStepIndex = statusSteps.indexOf(order.status)

  const statusColors: Record<string, string> = {
    'PENDING': 'text-amber-500',
    'PROCESSING': 'text-blue-500',
    'SHIPPED': 'text-indigo-500',
    'DELIVERED': 'text-emerald-500',
    'CANCELLED': 'text-red-500',
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Ambient Glows */}
      <div className="ambient-glow top-0 right-0 opacity-20"></div>
      <div className="ambient-glow bottom-0 left-0 opacity-20"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <Link href="/profile" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 mb-8 font-bold animate-fade-in-up">
          <ChevronLeft size={18} /> Back to My Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Order <span className="text-gradient">#{order.id.slice(-6).toUpperCase()}</span></h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className={`font-black uppercase tracking-widest ${statusColors[order.status]}`}>{order.status}</span>
            </div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-2xl flex items-center gap-3">
            <CheckCircle2 size={24} />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest">Total Paid</span>
              <span className="text-xl font-black">${order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        {order.status !== 'CANCELLED' && (
          <div className="glass-card rounded-3xl p-8 mb-12 border border-white/5 animate-fade-in-up">
            <div className="relative flex justify-between items-center max-w-3xl mx-auto">
              <div className="absolute h-1 bg-white/10 top-1/2 left-0 right-0 -translate-y-1/2 z-0 rounded-full"></div>
              <div 
                className="absolute h-1 bg-gradient-primary top-1/2 left-0 transition-all duration-1000 ease-out z-0 rounded-full"
                style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
              ></div>
              
              {statusSteps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex
                const isActive = idx === currentStepIndex
                
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                      isCompleted ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-900 border-white/10'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={18} className="text-white" /> : <div className="w-2 h-2 bg-white/20 rounded-full"></div>}
                    </div>
                    <span className={`text-[10px] font-black tracking-widest uppercase text-center ${isCompleted ? 'text-white' : 'text-slate-500'}`}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in-up delay-100">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Package size={20} className="text-indigo-400" /> Order Items
            </h2>
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(order as any).items.map((item: any) => (
                <div key={item.id} className="flex gap-6 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-slate-900 rounded-2xl flex-shrink-0 relative overflow-hidden glass">
                    <Image 
                      src={item.image || 'https://via.placeholder.com/100'} 
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">{item.name}</h4>
                      <p className="text-slate-500 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-indigo-400 font-black text-xl">${item.price.toLocaleString()}</span>
                      <span className="text-slate-500 text-sm">Subtotal: ${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="lg:col-span-1 space-y-8 animate-fade-in-up delay-200">
            {/* Shipping Info */}
            <div className="glass-card rounded-3xl p-8 border border-white/5">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <MapPin size={18} className="text-indigo-400" /> Shipping Info
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Customer</p>
                  <p className="text-white font-bold">{order.address.fullName}</p>
                  <p className="text-slate-400 text-sm">{order.address.phone}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Address</p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {order.address.street}, {order.address.city}<br />
                    {order.address.state} {order.address.postalCode}, {order.address.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="glass-card rounded-3xl p-8 border border-white/5">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-400" /> Payment Summary
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${(order.totalAmount / 1.08).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Tax (8%)</span>
                  <span className="text-white font-medium">${(order.totalAmount - (order.totalAmount / 1.08)).toLocaleString()}</span>
                </div>
                <div className="h-[1px] bg-white/10 my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Grand Total</span>
                  <span className="text-2xl font-black text-gradient">${order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black text-center uppercase tracking-widest">
                Payment Received
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
