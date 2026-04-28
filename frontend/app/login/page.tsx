'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden pt-20 pb-12">
      {/* Background gradients */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-fade-in-up">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] transform -rotate-12 hover:rotate-0 transition-all duration-500">
            <Zap size={32} fill="currentColor" />
          </div>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/10 relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-white mb-2 text-center tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 text-center mb-8">Sign in to your VoltGear account</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm flex items-center">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full bg-gradient-primary text-white rounded-xl py-3.5 font-bold hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-2"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? 'Signing in...' : 'Sign In'}
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
              <p className="text-sm text-slate-400">
                New to VoltGear?{' '}
                <Link href="/register" className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline transition-all">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}