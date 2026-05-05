'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ChevronLeft, 
  Save, 
  Image as ImageIcon, 
  Plus, 
  X, 
  Loader2, 
  Tag, 
  Box, 
  DollarSign, 
  FileText 
} from 'lucide-react'
import api from '../../../../lib/api'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  name: string
}

export default function EditProduct() {
  const router = useRouter()
  const { id } = useParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    brand: '',
    categoryId: '',
    images: ['']
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true)
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products`) // We need to find the product by ID, but our API uses slug for public view. 
          // However, admin PATCH uses ID. Let's assume we can fetch by ID in a real scenario or find in list.
          // For now, I'll fetch all and find, or assume /products/:id works for admin.
        ])
        
        setCategories(catRes.data.data)
        
        // Find specific product. Ideally we have a GET /products/:id endpoint.
        // Let's check all products and find the one with this ID for this demo.
        const product = prodRes.data.data.find((p: any) => p.id === id)
        
        if (product) {
          setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString(),
            brand: product.brand,
            categoryId: product.categoryId,
            images: product.images.length > 0 ? product.images : ['']
          })
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [id])

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] })
  }

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] })
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({ ...formData, images: newImages })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim() !== '')
      }
      await api.patch(`/products/${id}`, payload)
      router.push('/admin/products')
    } catch (err) {
      console.error('Failed to update product:', err)
      alert('Failed to update product.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <Link href="/admin/products" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-bold">
          <ChevronLeft size={18} /> Back to Catalog
        </Link>
        <div className="flex gap-4">
          <button 
            type="submit" 
            form="product-form"
            disabled={loading}
            className="bg-gradient-primary text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Update Changes</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
              <FileText className="text-indigo-400" /> Edit <span className="text-gradient">Information</span>
            </h2>
            
            <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Brand</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      required
                      type="text" 
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Category</label>
                  <select 
                    required
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Description</label>
                <textarea 
                  required
                  rows={6}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner resize-none"
                ></textarea>
              </div>
            </form>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
              <DollarSign className="text-emerald-400" /> Inventory <span className="text-emerald-400">&</span> Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Price ($)</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Stock Units</label>
                <div className="relative">
                  <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    required
                    type="number" 
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-8 sticky top-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
              <ImageIcon className="text-amber-400" /> Product <span className="text-amber-400">Media</span>
            </h2>
            
            <div className="space-y-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <input 
                    type="text" 
                    value={img}
                    onChange={e => handleImageChange(idx, e.target.value)}
                    className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-all pr-12" 
                  />
                  {formData.images.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button"
                onClick={handleAddImage}
                className="w-full border border-dashed border-white/10 rounded-xl py-3 text-slate-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-bold text-sm"
              >
                <Plus size={16} /> Add More Images
              </button>
            </div>

            <div className="aspect-square rounded-2xl bg-slate-900 border border-white/5 overflow-hidden flex items-center justify-center relative glass">
              {formData.images[0] ? (
                <Image 
                  src={formData.images[0]} 
                  alt="Preview" 
                  fill 
                  className="object-contain p-4"
                  onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/300?text=Invalid+URL' }}
                />
              ) : (
                <div className="text-center p-8">
                  <ImageIcon size={48} className="text-slate-800 mx-auto mb-4" />
                  <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Live Preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
