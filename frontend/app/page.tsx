import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Premium Tech Accessories
        </h1>
        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
          Cables, chargers, earphones and more — everything your devices need.
        </p>
        <Link
          href="/products"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition text-lg"
        >
          Shop Now
        </Link>
      </section>

      {/* Features */}
      <section className="py-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-gray-200">
        {[
          {
            title: 'Fast Shipping',
            description: 'Get your order delivered within 2-3 business days'
          },
          {
            title: 'Quality Guaranteed',
            description: 'All products are tested and certified'
          },
          {
            title: 'Easy Returns',
            description: '30-day hassle-free return policy'
          }
        ].map((feature) => (
          <div key={feature.title} className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-sm">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}