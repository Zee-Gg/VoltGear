'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, User, LogOut, Menu, X, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Volt<span className="text-indigo-400">Gear</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 glass px-8 py-3 rounded-full">
            <Link href="/products" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Categories
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-6">
            {/* Cart */}
            <Link href="/cart" className="relative text-slate-300 hover:text-white transition-colors group">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ShoppingCart size={20} />
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-[0_0_10px_rgba(79,70,229,0.8)] border border-indigo-400">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                  <User size={20} />
                </Link>
                <button
                  onClick={logout}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-white text-slate-900 px-5 py-2.5 rounded-full hover:bg-slate-200 transition-colors shadow-lg"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-10 h-10 rounded-full glass flex items-center justify-center text-slate-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 glass rounded-2xl p-4 flex flex-col gap-4 border border-white/10 animate-fade-in-up">
            <Link href="/products" className="text-slate-300 hover:text-white font-medium px-4 py-2" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
            <Link href="/categories" className="text-slate-300 hover:text-white font-medium px-4 py-2" onClick={() => setMenuOpen(false)}>
              Categories
            </Link>
            <Link href="/cart" className="text-slate-300 hover:text-white font-medium px-4 py-2 flex items-center justify-between" onClick={() => setMenuOpen(false)}>
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="bg-indigo-600 text-white text-xs font-bold rounded-full px-2 py-1">
                  {itemCount}
                </span>
              )}
            </Link>
            <div className="h-[1px] bg-white/10 my-2"></div>
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="text-slate-300 hover:text-white font-medium px-4 py-2" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button onClick={logout} className="text-red-400 hover:text-red-300 font-medium text-left px-4 py-2">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <Link href="/login" className="w-full text-center py-3 rounded-xl glass text-white font-medium" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link href="/register" className="w-full text-center py-3 rounded-xl bg-white text-slate-900 font-medium" onClick={() => setMenuOpen(false)}>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}