'use client'

import Link from 'next/link'
import { CheckCircle2, ArrowRight, ShoppingBag, Truck } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-20 px-4">
      {/* Background ambient glows */}
      <div className="ambient-glow top-1/4 left-1/4 opacity-30"></div>
      <div className="ambient-glow bottom-1/4 right-1/4 opacity-30" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(15,23,42,0) 70%)' }}></div>

      <div className="max-w-xl w-full text-center animate-fade-in-up">
        <div className="mb-8 relative inline-block">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white border-4 border-background animate-pulse">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Order Placed Successfully!</h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          Thank you for choosing VoltGear. We&apos;ve received your order and we&apos;re getting it ready for shipment. You&apos;ll receive a confirmation email shortly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="glass p-6 rounded-3xl border border-white/5 text-left">
            <Truck className="text-indigo-400 mb-3" size={24} />
            <h3 className="text-white font-bold text-sm mb-1">Track Shipment</h3>
            <p className="text-slate-500 text-xs">Tracking will be available once your order ships.</p>
          </div>
          <div className="glass p-6 rounded-3xl border border-white/5 text-left">
            <ShoppingBag className="text-indigo-400 mb-3" size={24} />
            <h3 className="text-white font-bold text-sm mb-1">Support</h3>
            <p className="text-slate-500 text-xs">Need help? Contact our premium support team.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/products" 
            className="flex-1 bg-gradient-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_10px_20px_rgba(79,70,229,0.3)]"
          >
            Continue Shopping <ArrowRight size={18} />
          </Link>
          <Link 
            href="/profile" 
            className="flex-1 glass bg-white/5 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10"
          >
            View My Orders
          </Link>
        </div>

        <p className="mt-12 text-slate-500 text-sm">
          Redirecting you to your profile in 10 seconds...
        </p>
      </div>
    </div>
  )
}
