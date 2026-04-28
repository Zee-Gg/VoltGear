'use client'

import Link from 'next/link'
import { Zap, Headphones, Zap as ChargerIcon, Cable, ArrowRight } from 'lucide-react'

const categories = [
  {
    name: 'Cables',
    slug: 'cables',
    description: 'High-speed data transfer and fast charging cables built to last.',
    icon: Cable,
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-500/10'
  },
  {
    name: 'Chargers',
    slug: 'chargers',
    description: 'Compact, powerful GaN chargers for all your devices.',
    icon: ChargerIcon,
    color: 'from-violet-500 to-fuchsia-600',
    bgLight: 'bg-violet-500/10'
  },
  {
    name: 'Earphones',
    slug: 'earphones',
    description: 'Premium wireless audio with active noise cancellation.',
    icon: Headphones,
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-500/10'
  }
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-40 -left-64 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-64 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in-up">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            <Zap size={14} />
            <span>Product Categories</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Browse by Category</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Find exactly what you need. Explore our curated collections of premium tech accessories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link 
                key={category.slug} 
                href={`/products?category=${category.slug}`}
                className="group relative"
              >
                <div className="glass bg-slate-900/40 rounded-3xl border border-white/5 p-8 h-full hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.3)] overflow-hidden">
                  {/* Subtle background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-16 h-16 rounded-2xl ${category.bgLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon size={32} className={`text-transparent bg-clip-text bg-gradient-to-br ${category.color} drop-shadow-sm`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300">
                      {category.name}
                    </h3>
                    
                    <p className="text-slate-400 mb-8 flex-grow">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center text-sm font-bold text-indigo-400 gap-2 mt-auto">
                      Explore Collection
                      <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
