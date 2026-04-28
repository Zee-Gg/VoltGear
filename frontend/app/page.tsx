import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, Shield, RefreshCcw, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
      {/* Hero Section */}
      <section className="py-24 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-300">New AirPods Max alternative just dropped</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up delay-100 leading-tight text-white">
            Audio that <br className="hidden lg:block" />
            <span className="text-gradient">Defies Gravity.</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-200">
            Experience studio-quality sound with our next-generation wireless headphones. Crafted for audiophiles, designed for everyday comfort.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up delay-300">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              Shop Collection <ArrowRight size={20} />
            </Link>
            <Link
              href="/products/categories"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass hover:bg-white/10 text-white font-semibold transition-all"
            >
              View Categories
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 animate-fade-in-up delay-300">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold">
                  U{i}
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-slate-400 font-medium mt-1">Trusted by 10k+ customers</span>
            </div>
          </div>
        </div>

        {/* Hero Image Container */}
        <div className="flex-1 relative flex justify-center animate-fade-in-up delay-200">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 lg:w-[500px] lg:h-[500px] bg-indigo-500/20 rounded-full blur-[100px]"></div>
          <div className="relative w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] animate-float">
            <Image
              src="/images/headphones.png"
              alt="Premium Headphones"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
          
          {/* Floating Spec Cards */}
          <div className="absolute top-10 right-0 lg:-right-10 glass px-4 py-3 rounded-2xl animate-fade-in-up delay-300 hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Battery Life</p>
              <p className="text-sm font-bold text-white">40 Hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories/Products Peek */}
      <section className="py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Trending Tech</h2>
            <p className="text-slate-400">Elevate your digital lifestyle.</p>
          </div>
          <Link href="/products" className="hidden sm:flex text-indigo-400 hover:text-indigo-300 font-medium items-center gap-1 transition-colors">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature Card 1 */}
          <Link href="/products?category=audio" className="group glass-card rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-indigo-500/20"></div>
            <div className="flex-1 z-10 text-center sm:text-left">
              <span className="text-indigo-400 font-semibold tracking-wider text-sm uppercase mb-2 block">Audio Gear</span>
              <h3 className="text-2xl font-bold text-white mb-4">Immersive Soundscapes</h3>
              <span className="text-slate-300 group-hover:text-white transition-colors flex items-center justify-center sm:justify-start gap-2">
                Explore Audio <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <div className="w-48 h-48 relative z-10 transform group-hover:scale-110 transition-transform duration-500">
              <Image src="/images/headphones.png" alt="Audio" fill className="object-contain" />
            </div>
          </Link>

          {/* Feature Card 2 */}
          <Link href="/products?category=wearables" className="group glass-card rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20 transition-all group-hover:bg-emerald-500/20"></div>
            <div className="flex-1 z-10 text-center sm:text-left">
              <span className="text-emerald-400 font-semibold tracking-wider text-sm uppercase mb-2 block">Wearables</span>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Connectivity</h3>
              <span className="text-slate-300 group-hover:text-white transition-colors flex items-center justify-center sm:justify-start gap-2">
                Explore Watches <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <div className="w-48 h-48 relative z-10 transform group-hover:scale-110 transition-transform duration-500">
              <Image src="/images/smartwatch.png" alt="Smartwatch" fill className="object-contain" />
            </div>
          </Link>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 border-t border-white/5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {[
            {
              icon: <Zap className="text-indigo-400" size={32} />,
              title: 'Lightning Fast',
              description: 'Next-day delivery on all premium tech orders.'
            },
            {
              icon: <Shield className="text-emerald-400" size={32} />,
              title: 'Ironclad Warranty',
              description: '2-year comprehensive coverage on all devices.'
            },
            {
              icon: <RefreshCcw className="text-violet-400" size={32} />,
              title: 'Free Returns',
              description: '30-day no-questions-asked return policy.'
            }
          ].map((feature) => (
            <div key={feature.title} className="text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto sm:mx-0 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}