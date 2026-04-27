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
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition group">
      {/* Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-blue-600 font-medium mb-1">
          {product.category.name}
        </p>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-400 mb-2">{product.brand}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm text-gray-600">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">
            ({product.numReviews})
          </span>
        </div>

        {/* Price and cart */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>

          {product.stock > 0 ? (
            <Link
              href={`/products/${product.slug}`}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
            >
              <ShoppingCart size={16} />
            </Link>
          ) : (
            <span className="text-xs text-red-500 font-medium">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </div>
  )
}