import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star } from 'lucide-react'

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
  category: {
    name: string
    slug: string
  }
}

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="glass bg-slate-900/40 rounded-3xl border border-white/5 overflow-hidden hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.3)] transition-all duration-300 group">
      {/* Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-slate-800/50 relative overflow-hidden">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              No image
            </div>
          )}
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase mb-1.5">
          {product.category.name}
        </p>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-white hover:text-indigo-400 transition-colors line-clamp-2 mb-1.5 text-lg">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-slate-400 mb-3">{product.brand}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-medium text-slate-300">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500">
            ({product.numReviews})
          </span>
        </div>

        {/* Price and cart */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <span className="text-xl font-black text-white">
            ${product.price.toFixed(2)}
          </span>

          {product.stock > 0 ? (
            <Link
              href={`/products/${product.slug}`}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-gradient-primary text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]"
            >
              <ShoppingCart size={18} />
            </Link>
          ) : (
            <span className="text-xs text-red-400 font-medium bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </div>
  )
}