'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, 
  ShoppingCart, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import api from '../../lib/api'
import { useCart } from '../../context/CartContext'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  rating: number
  numReviews: number
  stock: number
  brand: string
  category: { name: string; slug: string }
}

export default function ProductDetailPage() {
  const { id: slug } = useParams()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/products/${slug}`)
        if (response.data.data) {
          setProduct(response.data.data)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Failed to fetch product:', err)
        setError(true)
        // Fallback for demo purposes if backend is not seeded
        if (slug === 'usb-c-cable-2m') {
            setProduct({
                id: '1',
                name: 'VoltGear Ultra-Durable USB-C Cable (2m)',
                slug: 'usb-c-cable-2m',
                description: 'Experience lightning-fast charging and data transfer with our premium braided USB-C cable. Built with reinforced Kevlar core and aluminum connectors, this cable is designed to withstand over 30,000 bends, making it the last cable you will ever need to buy.',
                price: 12.99,
                images: [
                    'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=1000',
                    'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=1000',
                    'https://images.unsplash.com/photo-1526733158272-60b4946274e9?q=80&w=1000'
                ],
                rating: 4.8,
                numReviews: 124,
                stock: 50,
                brand: 'VoltGear',
                category: { name: 'Cables', slug: 'cables' }
            })
            setError(false)
        }
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchProduct()
  }, [slug])

  const handleAddToCart = async () => {
    if (!product) return
    try {
      setAddingToCart(true)
      await addToCart(product.id, quantity)
      setAddedFeedback(true)
      setTimeout(() => setAddedFeedback(false), 3000)
    } catch (err) {
      console.error('Failed to add to cart:', err)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 px-4 text-center">
        <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
        <p className="text-slate-400 mb-8">The product you are looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/products" className="bg-gradient-primary text-white px-8 py-3 rounded-full font-bold">
          Browse All Products
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="ambient-glow top-0 right-0 opacity-20"></div>
      <div className="ambient-glow bottom-0 left-0 opacity-20"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 animate-fade-in-up">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <ChevronRight size={14} />
          <Link href={`/categories/${product.category.slug}`} className="hover:text-white transition-colors capitalize">{product.category.name}</Link>
          <ChevronRight size={14} />
          <span className="text-slate-300 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4 animate-fade-in-up">
            <div className="glass-card rounded-3xl overflow-hidden aspect-square relative bg-slate-900 group">
              <Image 
                src={product.images[activeImage] || 'https://via.placeholder.com/600'} 
                alt={product.name}
                fill
                className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                PREMIUM GEAR
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-24 h-24 rounded-2xl flex-shrink-0 glass overflow-hidden border-2 transition-all ${
                    activeImage === idx ? 'border-indigo-500 scale-105 shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${idx}`} width={100} height={100} className="object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col gap-6 animate-fade-in-up delay-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
                {product.brand}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="text-white font-bold">{product.rating}</span>
                  <span className="text-slate-500 text-sm">({product.numReviews} Reviews)</span>
                </div>
                {product.stock > 0 ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold">
                    <CheckCircle2 size={16} /> In Stock
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-red-400 text-sm font-bold">
                    <AlertCircle size={16} /> Out of Stock
                  </div>
                )}
              </div>
            </div>

            <div className="text-4xl font-black text-gradient">
              ${product.price.toLocaleString()}
            </div>

            <div className="h-[1px] bg-white/10 w-full"></div>

            <p className="text-slate-400 leading-relaxed text-lg">
              {product.description}
            </p>

            <div className="flex flex-col gap-6 mt-4">
              {/* Quantity Selector */}
              <div className="flex flex-col gap-3">
                <span className="text-white font-bold text-sm uppercase tracking-wider">Quantity</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-900 rounded-2xl p-1 border border-white/5">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-12 text-center text-white font-black text-xl">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <span className="text-slate-500 text-sm">{product.stock} pieces available</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className={`flex-1 relative h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 overflow-hidden ${
                    addedFeedback 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gradient-primary text-white shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {addingToCart ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : addedFeedback ? (
                    <>
                      <CheckCircle2 size={24} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={24} /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="glass p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Truck size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xs font-bold">Fast Delivery</span>
                  <span className="text-slate-500 text-[10px]">2-4 Business Days</span>
                </div>
              </div>
              <div className="glass p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xs font-bold">1 Year Warranty</span>
                  <span className="text-slate-500 text-[10px]">Quality Guaranteed</span>
                </div>
              </div>
              <div className="glass p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <RotateCcw size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xs font-bold">Easy Returns</span>
                  <span className="text-slate-500 text-[10px]">30 Day Window</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        <div className="mt-24 animate-fade-in-up delay-200">
          <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Technical <span className="text-gradient">Specifications</span></h2>
          <div className="glass-card rounded-3xl p-8 sm:p-12 overflow-hidden relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-slate-400">Model Name</span>
                  <span className="text-white font-bold">VG-{product.slug.toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-slate-400">Brand</span>
                  <span className="text-white font-bold">{product.brand}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-slate-400">Category</span>
                  <span className="text-white font-bold capitalize">{product.category.name}</span>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-slate-400">Warranty</span>
                  <span className="text-white font-bold">12 Months</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-slate-400">Certifications</span>
                  <span className="text-white font-bold">CE, FCC, RoHS</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-slate-400">Materials</span>
                  <span className="text-white font-bold">Premium Grade</span>
                </div>
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
