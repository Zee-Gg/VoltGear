'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Loader2, 
  Filter,
  ExternalLink,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react'
import api from '../../lib/api'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  images: string[]
  brand: string
  category: { name: string }
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/products')
      setProducts(response.data.data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      setDeletingId(id)
      await api.delete(`/products/${id}`)
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete product:', err)
      alert('Failed to delete product. It might be linked to existing orders.')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && products.length === 0) {
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
            <Package size={36} className="text-indigo-400" /> Catalog <span className="text-gradient">Management</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage your inventory, prices, and product details here.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-gradient-primary text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:scale-[1.02] transition-all"
        >
          <Plus size={20} /> Add New Product
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search products by name or brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
          />
        </div>
        <button className="bg-slate-900 border border-white/5 text-slate-400 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/5 transition-all">
          <Filter size={20} /> Filters
        </button>
      </div>

      {/* Product Table */}
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Product</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Inventory</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Price</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-950 rounded-xl flex-shrink-0 relative overflow-hidden glass border border-white/5">
                        <Image 
                          src={product.images[0] || 'https://via.placeholder.com/100'} 
                          alt={product.name}
                          fill
                          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-white font-bold text-sm truncate group-hover:text-indigo-400 transition-colors">{product.name}</span>
                        <span className="text-slate-500 text-xs font-medium">{product.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-white/5 rounded-lg text-slate-300 text-xs font-bold uppercase tracking-widest border border-white/5">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className={`text-sm font-bold ${product.stock < 10 ? 'text-amber-400' : 'text-white'}`}>
                        {product.stock} units
                      </span>
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${product.stock < 10 ? 'bg-amber-400' : 'bg-emerald-500'} transition-all`} 
                          style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-white font-black text-lg">${product.price.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/products/edit/${product.id}`}
                        className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all shadow-lg"
                      >
                        <Edit3 size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg disabled:opacity-50"
                      >
                        {deletingId === product.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                      <Link 
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="w-10 h-10 rounded-xl bg-white/5 text-slate-500 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-white/5"
                      >
                        <ExternalLink size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 text-slate-700">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search term or add a new product.</p>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="px-8 py-6 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Showing <span className="text-white">{filteredProducts.length}</span> of <span className="text-white">{products.length}</span> products
          </p>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-white/5 text-slate-500 flex items-center justify-center border border-white/5 cursor-not-allowed">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/10 shadow-lg">
              1
            </button>
            <button className="w-10 h-10 rounded-xl bg-white/5 text-slate-500 flex items-center justify-center border border-white/5 cursor-not-allowed">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
