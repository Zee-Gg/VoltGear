'use client'

import { useAuth } from '../context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Ticket, 
  ChevronRight,
  LogOut,
  ShieldCheck,
  Loader2
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== 'ADMIN') {
        router.push('/')
      }
    }
  }, [isAuthenticated, user, loading, router])

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/50 border-r border-white/5 flex flex-col sticky top-0 h-screen overflow-hidden glass">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-transform">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">VOLT<span className="text-gradient">GEAR</span></span>
          </Link>
          <div className="mt-2 px-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-2 py-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all group ${
                  isActive 
                  ? 'bg-gradient-primary text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-indigo-400 transition-colors'} />
                  {item.name}
                </div>
                {isActive && <ChevronRight size={16} className="text-white/50" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <div className="bg-white/5 rounded-3xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white font-bold text-sm truncate">{user.name}</span>
                <span className="text-slate-500 text-xs truncate">{user.email}</span>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 font-bold text-xs py-2 transition-colors"
            >
              <LogOut size={14} /> Logout Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.05),transparent_50%)]">
        <div className="p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  )
}
