'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  AlertCircle,
  Loader2,
  Lock
} from 'lucide-react'
import Image from 'next/image'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Address {
  id: string
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

// Sub-component for Stripe Payment Form
const PaymentForm = ({ 
  clientSecret, 
  onSuccess 
}: { 
  clientSecret: string, 
  onSuccess: () => void 
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    })

    if (stripeError) {
      setError(stripeError.message || 'Payment failed')
      setProcessing(false)
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="glass p-6 rounded-2xl border border-white/10">
        <label className="block text-white font-bold mb-4 flex items-center gap-2">
          <CreditCard size={18} /> Card Details
        </label>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#f8fafc',
                  '::placeholder': { color: '#64748b' },
                },
                invalid: { color: '#ef4444' },
              },
            }}
          />
        </div>
        {error && <p className="text-red-400 text-sm mt-3 flex items-center gap-2"><AlertCircle size={14} /> {error}</p>}
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-primary text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {processing ? <Loader2 className="animate-spin" /> : <><Lock size={20} /> Pay Now</>}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const { items, total, loading: cartLoading, clearCart } = useCart()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'US'
  })
  
  const [orderId, setOrderId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/addresses')
        setAddresses(response.data.data)
        if (response.data.data.length > 0) {
          const defaultAddr = response.data.data.find((a: Address) => a.isDefault)
          setSelectedAddress(defaultAddr ? defaultAddr.id : response.data.data[0].id)
        }
      } catch (err) {
        console.error('Failed to fetch addresses:', err)
      }
    }
    if (isAuthenticated) fetchAddresses()
  }, [isAuthenticated])

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await api.post('/addresses', newAddress)
      setAddresses([...addresses, response.data.data])
      setSelectedAddress(response.data.data.id)
      setShowAddressForm(false)
    } catch (err) {
      console.error('Failed to add address:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleProceedToPayment = async () => {
    if (!selectedAddress) return

    try {
      setLoading(true)
      // 1. Create Order
      const orderRes = await api.post('/orders', { addressId: selectedAddress })
      const newOrderId = orderRes.data.data.id
      setOrderId(newOrderId)

      // 2. Create Payment Intent
      const paymentRes = await api.post('/payments/create-payment-intent', { orderId: newOrderId })
      setClientSecret(paymentRes.data.data.clientSecret)

      setStep('payment')
    } catch (err) {
      console.error('Failed to initiate payment:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    await clearCart()
    router.push('/checkout/success')
  }

  if (authLoading || cartLoading || (items.length === 0 && step === 'shipping' && !loading)) {
    if (items.length === 0 && !cartLoading && !loading) {
       router.push('/cart')
       return null
    }
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  const tax = total * 0.08
  const grandTotal = total + tax

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Progress Tracker */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step === 'shipping' ? 'bg-primary text-white scale-110 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-emerald-500 text-white'}`}>
              {step === 'payment' ? <CheckCircle2 size={20} /> : 1}
            </div>
            <div className={`h-1 w-20 rounded-full ${step === 'payment' ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step === 'payment' ? 'bg-primary text-white scale-110 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-white/10 text-slate-500'}`}>
              2
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Flow Column */}
          <div className="lg:col-span-2 space-y-8">
            {step === 'shipping' ? (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                  <Truck className="text-indigo-400" /> Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`p-6 rounded-2xl text-left transition-all border ${
                        selectedAddress === addr.id 
                        ? 'glass border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(79,70,229,0.2)]' 
                        : 'glass border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-white">{addr.fullName}</span>
                        {selectedAddress === addr.id && <CheckCircle2 size={18} className="text-indigo-400" />}
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {addr.street}, {addr.city}<br />
                        {addr.state} {addr.postalCode}, {addr.country}
                      </p>
                      <p className="text-slate-500 text-xs mt-3">{addr.phone}</p>
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="p-6 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all text-slate-400 hover:text-white group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-all">
                      <Plus size={24} />
                    </div>
                    <span className="font-bold">Add New Address</span>
                  </button>
                </div>

                {showAddressForm && (
                  <div className="glass p-8 rounded-3xl border border-white/10 mb-8 animate-fade-in-up">
                    <h3 className="text-xl font-bold text-white mb-6">New Shipping Address</h3>
                    <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Full Name</label>
                        <input required value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Phone</label>
                        <input required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Street</label>
                        <input required value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">City</label>
                        <input required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">State</label>
                        <input required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Postal Code</label>
                        <input required value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                      </div>
                      <div className="md:col-span-2 flex gap-4 mt-2">
                        <button type="submit" disabled={loading} className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">Save Address</button>
                        <button type="button" onClick={() => setShowAddressForm(false)} className="bg-white/5 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                <button
                  disabled={!selectedAddress || loading}
                  onClick={handleProceedToPayment}
                  className="w-full bg-gradient-primary text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Continue to Payment <ArrowRight size={20} /></>}
                </button>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <button 
                  onClick={() => setStep('shipping')}
                  className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 font-bold transition-colors"
                >
                  <ArrowLeft size={18} /> Change Shipping Address
                </button>
                <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                  <CreditCard className="text-indigo-400" /> Secure Payment
                </h2>

                {clientSecret && orderId && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm 
                      clientSecret={clientSecret} 
                      onSuccess={handlePaymentSuccess} 
                    />
                  </Elements>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-8 sticky top-32 animate-fade-in-up delay-200">
              <h3 className="text-2xl font-black text-white mb-6 tracking-tight">Order Summary</h3>
              
              <div className="flex flex-col gap-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-900 rounded-xl flex-shrink-0 relative overflow-hidden glass">
                      <Image 
                        src={item.product.images[0] || 'https://via.placeholder.com/100'} 
                        alt={item.product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex flex-col flex-grow min-w-0">
                      <p className="text-white font-bold text-sm truncate">{item.product.name}</p>
                      <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                      <p className="text-indigo-400 font-bold text-sm mt-auto">${(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-white/5">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Estimated Tax</span>
                  <span className="text-white font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="h-[1px] bg-white/10 my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-black text-gradient">${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                <div className="flex gap-3 text-slate-400">
                  <Lock size={16} className="flex-shrink-0" />
                  <p className="text-[10px] leading-relaxed">
                    Your data is protected by industry-standard encryption. Payments are processed securely via Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
