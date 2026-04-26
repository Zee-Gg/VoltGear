'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'
import { useAuth } from './AuthContext'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    images: string[]
  }
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  total: number
  loading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  fetchCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  const fetchCart = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      const response = await api.get('/cart')
      setItems(response.data.data.items || [])
      setTotal(response.data.data.total || 0)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [isAuthenticated])

  const addToCart = async (productId: string, quantity = 1) => {
    await api.post('/cart', { productId, quantity })
    await fetchCart()
  }

  const updateItem = async (itemId: string, quantity: number) => {
    await api.patch(`/cart/${itemId}`, { quantity })
    await fetchCart()
  }

  const removeItem = async (itemId: string) => {
    await api.delete(`/cart/${itemId}`)
    await fetchCart()
  }

  const clearCart = async () => {
    await api.delete('/cart/clear')
    await fetchCart()
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        loading,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}