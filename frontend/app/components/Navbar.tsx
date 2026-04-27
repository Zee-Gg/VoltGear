'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            VoltGear
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-gray-600 hover:text-blue-600 transition">
              Products
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-blue-600 transition">
              Categories
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition">
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" className="relative text-gray-600 hover:text-blue-600 transition">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition">
                  <User size={22} />
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-500 transition"
                >
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 flex flex-col gap-4 border-t border-gray-100">
            <Link href="/products" className="text-gray-600" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
            <Link href="/categories" className="text-gray-600" onClick={() => setMenuOpen(false)}>
              Categories
            </Link>
            <Link href="/cart" className="text-gray-600" onClick={() => setMenuOpen(false)}>
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="text-gray-600" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button onClick={logout} className="text-red-500 text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}