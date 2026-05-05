'use client'

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CartPage() {
  const { items, total, loading, updateItem, removeItem, itemCount } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/cart')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-8 glass">
            <ShoppingBag size={40} className="text-slate-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Your Cart is Empty</h1>
          <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
            Looks like you haven&apos;t added anything to your cart yet. Explore our latest gear and find something you love.
          </p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-gradient-primary text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          >
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  const shipping = 0 // Free shipping for premium tech gear
  const tax = total * 0.08 // 8% tax
  const grandTotal = total + shipping + tax

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Glows */}
      <div className="ambient-glow top-0 left-[-10%] opacity-20"></div>
      <div className="ambient-glow bottom-0 right-[-10%] opacity-20"></div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in-up">
            <div>
              <Link href="/products" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 mb-2 text-sm font-medium">
                <ChevronLeft size={16} /> Back to Products
              </Link>
              <h1 className="text-4xl font-black text-white tracking-tight">
                Shopping <span className="text-gradient">Cart</span>
              </h1>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-slate-400 text-sm">Items in Cart</p>
              <p className="text-2xl font-bold text-white">{itemCount}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 relative group">
                    <Image 
                      src={item.product.images[0] || 'https://via.placeholder.com/150'} 
                      alt={item.product.name}
                      fill
                      className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow flex flex-col sm:flex-row justify-between w-full gap-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {item.product.name}
                      </h3>
                      <p className="text-slate-400 text-sm">SKU: VG-{item.product.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-indigo-400 font-bold mt-2 sm:mt-auto text-lg">
                        ${item.product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-slate-900/50 rounded-full p-1 border border-white/5">
                        <button 
                          onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-white font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-medium p-2"
                      >
                        <Trash2 size={16} /> <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-3xl p-8 sticky top-32 animate-fade-in-up delay-300">
                <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
                
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Shipping</span>
                    <span className="text-emerald-400 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Estimated Tax</span>
                    <span className="text-white font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="h-[1px] bg-white/10 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-black text-gradient">${grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Link 
                    href="/checkout"
                    className="w-full bg-gradient-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_10px_20px_rgba(79,70,229,0.3)] group"
                  >
                    Checkout Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <p className="text-center text-slate-500 text-xs">
                    Secure checkout powered by Stripe. All transactions are encrypted.
                  </p>
                </div>

                {/* Promo Code */}
                <div className="mt-8">
                  <p className="text-white font-semibold mb-3 text-sm">Promo Code</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="ENTER CODE" 
                      className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white w-full focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
