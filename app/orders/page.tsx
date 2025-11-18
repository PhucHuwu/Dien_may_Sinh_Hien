'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, Download, RotateCcw } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Order {
  _id: string
  orderItems: Array<{
    name: string
    image: string
  }>
  totalPrice: number
  status: string
  createdAt: string
  isPaid: boolean
  isDelivered: boolean
}

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-800' },
    shipped: { label: 'Đang giao', color: 'bg-blue-100 text-blue-800' },
    delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  }
  return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        // Note: Trong thực tế cần có userId từ authentication
        const response = await fetch('/api/orders')
        const result = await response.json()

        if (result.success) {
          setOrders(result.data)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    if (filter === 'pending')
      return order.status === 'pending' || order.status === 'processing' || order.status === 'shipped'
    if (filter === 'completed') return order.status === 'delivered'
    if (filter === 'cancelled') return order.status === 'cancelled'
    return true
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Lịch sử đơn hàng</h1>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'pending', label: 'Đang xử lý' },
              { value: 'completed', label: 'Đã giao' },
              { value: 'cancelled', label: 'Đã hủy' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  filter === tab.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-input'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-6 bg-muted rounded w-1/3" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-card rounded-lg p-12 text-center">
              <p className="text-muted-foreground mb-4">Không có đơn hàng nào</p>
              <Link href="/products">
                <Button className="bg-primary text-primary-foreground">
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                const firstItem = order.orderItems[0]
                const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN')

                return (
                  <div
                    key={order._id}
                    className="bg-card rounded-lg p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                  >
                    <div className="flex gap-4 flex-1">
                      <img
                        src={firstItem?.image || "/placeholder.svg"}
                        alt={firstItem?.name || "Order"}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                        <p className="font-bold text-lg mb-2">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {orderDate} • {order.orderItems.length} sản phẩm
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-muted-foreground">Tổng tiền</p>
                      <p className="text-2xl font-bold text-primary mb-4">
                        {order.totalPrice.toLocaleString('vi-VN')}đ
                      </p>
                      <div className="flex gap-2 flex-col sm:flex-row">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Chi tiết
                        </Button>
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Hóa đơn
                          </Button>
                        )}
                        {order.status === 'shipped' && (
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4" />
                            Hủy đơn
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
