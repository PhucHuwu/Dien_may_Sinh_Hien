'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  image: string
  stock: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isLoading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()

  // Fetch cart from API when user is authenticated
  const fetchCart = async () => {
    if (status !== 'authenticated') {
      setItems([])
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/cart')
      const result = await response.json()

      if (result.success) {
        // Map items để có đúng định dạng CartItem
        const cartItems = result.data.items.map((item: any) => ({
          _id: item.product.toString(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          stock: item.stock,
        }))
        setItems(cartItems)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load cart when session changes
  useEffect(() => {
    fetchCart()
  }, [status])

  const addItem = async (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    if (status !== 'authenticated') {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: product.quantity || 1,
        }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchCart() // Refresh cart
        return
      } else {
        toast.error(result.message || 'Không thể thêm sản phẩm vào giỏ hàng')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Lỗi khi thêm sản phẩm vào giỏ hàng')
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (id: string) => {
    if (status !== 'authenticated') {
      toast.error('Vui lòng đăng nhập')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/cart?productId=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        await fetchCart() // Refresh cart
      } else {
        toast.error(result.message || 'Không thể xóa sản phẩm')
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast.error('Lỗi khi xóa sản phẩm')
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (status !== 'authenticated') {
      toast.error('Vui lòng đăng nhập')
      return
    }

    if (quantity < 1) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          quantity,
        }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchCart() // Refresh cart
      } else {
        toast.error(result.message || 'Không thể cập nhật số lượng')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Lỗi khi cập nhật số lượng')
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
