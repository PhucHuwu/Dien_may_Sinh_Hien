'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, Download, RotateCcw } from 'lucide-react'
import { useState } from 'react'

const orders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    total: '25,999,000',
    status: 'Đã giao',
    statusColor: 'bg-green-100 text-green-800',
    items: 3,
    image: '/modern-laptop-workspace.png',
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-10',
    total: '45,998,000',
    status: 'Đang giao',
    statusColor: 'bg-blue-100 text-blue-800',
    items: 2,
    image: '/modern-smartphone.png',
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-08',
    total: '3,999,000',
    status: 'Đang xử lý',
    statusColor: 'bg-yellow-100 text-yellow-800',
    items: 1,
    image: '/diverse-people-listening-headphones.png',
  },
  {
    id: 'ORD-2024-004',
    date: '2024-01-05',
    total: '8,999,000',
    status: 'Đã hủy',
    statusColor: 'bg-red-100 text-red-800',
    items: 1,
    image: '/modern-tablet-display.png',
  },
]

export default function OrdersPage() {
  const [filter, setFilter] = useState('all')

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    if (filter === 'pending')
      return order.status === 'Đang xử lý' || order.status === 'Đang giao'
    if (filter === 'completed') return order.status === 'Đã giao'
    if (filter === 'cancelled') return order.status === 'Đã hủy'
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
          {filteredOrders.length === 0 ? (
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
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card rounded-lg p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                >
                  <div className="flex gap-4 flex-1">
                    <img
                      src={order.image || "/placeholder.svg"}
                      alt={order.id}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                      <p className="font-bold text-lg mb-2">{order.id}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {order.date} • {order.items} sản phẩm
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${order.statusColor}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-muted-foreground">Tổng tiền</p>
                    <p className="text-2xl font-bold text-primary mb-4">{order.total}đ</p>
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Chi tiết
                      </Button>
                      {order.status === 'Đã giao' && (
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Hóa đơn
                        </Button>
                      )}
                      {order.status === 'Đang giao' && (
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" />
                          Hủy đơn
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
