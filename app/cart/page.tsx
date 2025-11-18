'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const cartItems = [
  {
    id: 1,
    name: 'Laptop Pro X1',
    price: '25,999,000',
    quantity: 1,
    image: '/modern-laptop-workspace.png',
  },
  {
    id: 2,
    name: 'Smartphone Ultra',
    price: '12,999,000',
    quantity: 2,
    image: '/modern-smartphone.png',
  },
]

export default function CartPage() {
  const [items, setItems] = useState(cartItems)

  const handleRemove = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setItems(
      items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    )
  }

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      parseInt(item.price.replace(/,/g, '')) * item.quantity,
    0
  )
  const shipping = 0
  const tax = Math.floor(subtotal * 0.1)
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Giỏ hàng của bạn</h1>

          {items.length === 0 ? (
            <div className="bg-card rounded-lg p-12 text-center">
              <p className="text-muted-foreground mb-4">Giỏ hàng của bạn trống</p>
              <Link href="/products">
                <Button className="bg-primary text-primary-foreground">
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card rounded-lg p-6 flex gap-6"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      <p className="text-primary font-bold text-lg">{item.price}đ</p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center border border-input rounded-lg">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-muted"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-muted"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-card rounded-lg p-6 h-fit sticky top-24">
                <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tạm tính:</span>
                    <span>{(subtotal / 1000000).toFixed(1)}M đ</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Vận chuyển:</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Thuế VAT (10%):</span>
                    <span>{(tax / 1000000).toFixed(1)}M đ</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6 text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{(total / 1000000).toFixed(1)}M đ</span>
                </div>
                <Link href="/checkout">
                  <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 mb-3">
                    Thanh toán
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
