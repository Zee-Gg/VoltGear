'use client'

import { useEffect, useState } from 'react'
import { 
  Users, 
  Search, 
  Shield, 
  User as UserIcon, 
  Trash2, 
  Loader2, 
  ChevronRight,
  Mail,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react'
import api from '../../lib/api'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users')
      setUsers(response.data.data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleUpdate = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'
    if (!confirm(`Are you sure you want to change this user to ${newRole}?`)) return

    try {
      setUpdatingId(id)
      await api.patch(`/users/${id}/role`, { role: newRole })
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    } catch (err) {
      console.error('Failed to update role:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return

    try {
      setUpdatingId(id)
      await api.delete(`/users/${id}`)
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      console.error('Failed to delete user:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && users.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
          <Users size={36} className="text-indigo-400" /> User <span className="text-gradient">Database</span>
        </h1>
        <p className="text-slate-500 font-medium">Manage user accounts, permissions, and security levels.</p>
      </div>

      {/* Toolbar */}
      <div className="max-w-xl relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search users by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
        />
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-black shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${user.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                {user.role}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{user.name}</h3>
                <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                  <Mail size={14} /> {user.email}
                </p>
              </div>
              <div className="flex items-center gap-4 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleRoleUpdate(user.id, user.role)}
                disabled={updatingId === user.id}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all border ${user.role === 'ADMIN' ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500 hover:text-white'}`}
              >
                {updatingId === user.id ? <Loader2 size={14} className="animate-spin" /> : user.role === 'ADMIN' ? <><ShieldAlert size={14} /> Demote</> : <><ShieldCheck size={14} /> Make Admin</>}
              </button>
              <button 
                onClick={() => handleDelete(user.id)}
                disabled={updatingId === user.id}
                className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20 shadow-lg disabled:opacity-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
