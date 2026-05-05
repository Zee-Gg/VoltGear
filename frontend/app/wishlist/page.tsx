'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2, ArrowRight, Loader2 } from 'lucide-react'
import api from '../lib/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    brand: string
  }
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await api.get('/wishlist')
      setItems(response.data.data.items || [])
    } catch (err) {
      console.error('Failed to fetch wishlist:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/wishlist')
    } else if (isAuthenticated) {
      fetchWishlist()
    }
  }, [isAuthenticated, authLoading, router])

  const removeFromWishlist = async (productId: string) => {
    try {
      await api.delete(`/wishlist/${productId}`)
      setItems(items.filter(item => item.product.id !== productId))
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1)
      // Optional: remove from wishlist after adding to cart? 
      // Many sites keep it, some remove it. Let's keep it for now.
    } catch (err) {
      console.error('Failed to add to cart:', err)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Ambient Glows */}
      <div className="ambient-glow top-0 right-0 opacity-20"></div>
      <div className="ambient-glow bottom-0 left-0 opacity-20"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12 animate-fade-in-up">
          <h1 className="text-4xl font-black text-white tracking-tight">
            My <span className="text-gradient">Wishlist</span>
          </h1>
          <div className="bg-slate-800/50 px-4 py-2 rounded-full border border-white/5 text-slate-300 text-sm font-bold">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border border-white/5 animate-fade-in-up">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Your wishlist is empty</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Save items you love to your wishlist and they&apos;ll show up here.
            </p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-gradient-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              Browse Products <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="glass-card rounded-3xl border border-white/5 overflow-hidden group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/products/${item.product.slug}`} className="block aspect-square relative bg-slate-900 overflow-hidden">
                  <Image 
                    src={item.product.images[0] || 'https://via.placeholder.com/300'} 
                    alt={item.product.name}
                    fill
                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={(e) => { e.preventDefault(); removeFromWishlist(item.product.id); }}
                      className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Link>

                <div className="p-6">
                  <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1">{item.product.brand}</p>
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-1 hover:text-indigo-400 transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-2xl font-black text-white mb-6">${item.product.price.toLocaleString()}</p>
                  
                  <button 
                    onClick={() => handleAddToCart(item.product.id)}
                    className="w-full bg-slate-800 hover:bg-gradient-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
