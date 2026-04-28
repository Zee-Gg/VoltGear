'use client'

import { useEffect, useState } from 'react'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Zap } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  rating: number
  numReviews: number
  stock: number
  brand: string
  category: { name: string; slug: string }
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'USB-C Cable 2m',
    slug: 'usb-c-cable-2m',
    price: 12.99,
    images: ['https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80'],
    rating: 4.8,
    numReviews: 124,
    stock: 100,
    brand: 'VoltGear',
    category: { name: 'Cables', slug: 'cables' }
  },
  {
    id: '2',
    name: '65W GaN Charger',
    slug: '65w-gan-charger',
    price: 34.99,
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'],
    rating: 4.9,
    numReviews: 89,
    stock: 50,
    brand: 'VoltGear',
    category: { name: 'Chargers', slug: 'chargers' }
  },
  {
    id: '3',
    name: 'Wireless Earbuds Pro',
    slug: 'wireless-earbuds-pro',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
    rating: 4.7,
    numReviews: 256,
    stock: 30,
    brand: 'VoltGear',
    category: { name: 'Earphones', slug: 'earphones' }
  }
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sort,
        order,
        ...(search && { search })
      })

      const response = await api.get(`/products?${params}`)
      
      if (response.data.data && response.data.data.length > 0) {
        setProducts(response.data.data)
        setPagination(response.data.pagination)
      } else {
        // Fallback to mock products if API returns empty
        setProducts(mockProducts)
        setPagination({ total: mockProducts.length, page: 1, limit: 12, totalPages: 1 })
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      // Fallback to mock products on error
      setProducts(mockProducts)
      setPagination({ total: mockProducts.length, page: 1, limit: 12, totalPages: 1 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, sort, order])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-40 -left-64 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-64 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in-up">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            <Zap size={14} />
            <span>VoltGear Collection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Our Products</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Discover our premium range of high-performance tech accessories designed for modern professionals.
          </p>
        </div>

        {/* Search and filters */}
        <div className="glass bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 mb-10 shadow-lg">
          <form onSubmit={handleSearch} className="flex-1 flex gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-primary text-white px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all font-medium"
            >
              Search
            </button>
          </form>

          {/* Sort */}
          <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-1 group focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all">
            <SlidersHorizontal size={18} className="text-slate-500 group-focus-within:text-indigo-400" />
            <select
              value={`${sort}-${order}`}
              onChange={(e) => {
                const [s, o] = e.target.value.split('-')
                setSort(s)
                setOrder(o)
                setPage(1)
              }}
              className="bg-transparent text-slate-300 py-3 focus:outline-none appearance-none pr-4 cursor-pointer font-medium"
            >
              <option value="createdAt-desc" className="bg-slate-900 text-white">Newest first</option>
              <option value="createdAt-asc" className="bg-slate-900 text-white">Oldest first</option>
              <option value="price-asc" className="bg-slate-900 text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-slate-900 text-white">Price: High to Low</option>
              <option value="rating-desc" className="bg-slate-900 text-white">Top rated</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        {!loading && (
          <div className="mb-6 text-slate-400 font-medium">
            Showing {products.length} of {pagination?.total || 0} products
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="glass bg-slate-900/40 rounded-3xl border border-white/5 overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-slate-800/50" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-3 bg-slate-800 rounded w-1/3" />
                  <div className="h-5 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                  <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between">
                    <div className="h-6 bg-slate-800 rounded w-1/4" />
                    <div className="h-8 w-8 bg-slate-800 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 glass bg-slate-900/40 rounded-3xl border border-white/5">
            <div className="inline-flex w-16 h-16 rounded-full bg-slate-800 items-center justify-center text-slate-500 mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
            <button
              onClick={() => { setSearch(''); setPage(1); fetchProducts() }}
              className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors bg-indigo-500/10 px-6 py-2.5 rounded-xl border border-indigo-500/20"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center glass bg-slate-900/40 border border-white/5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: pagination.totalPages }).map((_, i) => {
              // Simple pagination logic for demonstration (could be improved for many pages)
              if (
                i === 0 ||
                i === pagination.totalPages - 1 ||
                (i >= page - 2 && i <= page)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      page === i + 1
                        ? 'bg-gradient-primary text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                        : 'glass bg-slate-900/40 border border-white/5 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              }
              if (i === page - 3 || i === page + 1) {
                return <span key={i} className="text-slate-500 px-1">...</span>
              }
              return null
            })}

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
              className="w-10 h-10 flex items-center justify-center glass bg-slate-900/40 border border-white/5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}