'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, isLoading } = useCart()
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Show loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Đang tải giỏ hàng...</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Don't render if not authenticated
  if (!session) {
    return null
  }

  const subtotal = totalPrice
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
                    key={item._id}
                    className="bg-card rounded-lg p-6 flex gap-6"
                  >
                    <Link href={`/products/${item._id}`}>
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition cursor-pointer"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/products/${item._id}`}>
                        <h3 className="font-semibold text-lg mb-2 hover:text-primary transition cursor-pointer">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-primary font-bold text-lg">
                        {item.price.toLocaleString('vi-VN')}đ
                      </p>
                      {item.quantity >= item.stock && (
                        <p className="text-sm text-destructive mt-1">
                          Chỉ còn {item.stock} sản phẩm
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center border border-input rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-muted"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-muted"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
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
                    <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Vận chuyển:</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Thuế VAT (10%):</span>
                    <span>{tax.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6 text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{total.toLocaleString('vi-VN')}đ</span>
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
