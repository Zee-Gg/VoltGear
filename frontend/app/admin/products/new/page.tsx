'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import api from '../../../lib/api'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

export default function NewProduct() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
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
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories')
        setCategories(response.data.data)
        if (response.data.data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: response.data.data[0].id }))
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    fetchCategories()
  }, [])

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
      await api.post('/products', payload)
      router.push('/admin/products')
    } catch (err) {
      console.error('Failed to create product:', err)
      alert('Failed to create product. Check all fields.')
    } finally {
      setLoading(false)
    }
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
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Launch Product</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
              <FileText className="text-indigo-400" /> Basic <span className="text-gradient">Information</span>
            </h2>
            
            <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. VoltPulse Pro Smartwatch" 
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
                      placeholder="e.g. VoltGear" 
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
                  placeholder="Tell your customers about this amazing tech gear..." 
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner resize-none"
                ></textarea>
              </div>
            </form>
          </div>

          {/* Pricing & Stock */}
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
                  placeholder="99.99" 
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
                    placeholder="100" 
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Assets */}
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
                    placeholder="Image URL (Unsplash or direct link)" 
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
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
