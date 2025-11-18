'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { Star, Filter, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const products = [
  {
    id: 1,
    name: 'Laptop Pro X1',
    price: '25,999,000',
    originalPrice: '32,999,000',
    discount: '21%',
    image: '/laptop-modern.jpg',
    category: 'Laptop',
    rating: 4.8,
    reviews: 245,
  },
  {
    id: 2,
    name: 'Smartphone Ultra',
    price: '12,999,000',
    originalPrice: '15,999,000',
    discount: '19%',
    image: '/smartphone-modern.jpg',
    category: 'Điện thoại',
    rating: 4.7,
    reviews: 189,
  },
  {
    id: 3,
    name: 'Headphones Elite',
    price: '3,999,000',
    originalPrice: '5,999,000',
    discount: '33%',
    image: '/headphones-audio.jpg',
    category: 'Tai nghe',
    rating: 4.9,
    reviews: 312,
  },
  {
    id: 4,
    name: 'Tablet Max',
    price: '8,999,000',
    originalPrice: '11,999,000',
    discount: '25%',
    image: '/tablet-device.jpg',
    category: 'Máy tính bảng',
    rating: 4.6,
    reviews: 156,
  },
  {
    id: 5,
    name: 'Smart Watch Pro',
    price: '4,999,000',
    originalPrice: '6,999,000',
    discount: '29%',
    image: '/smartwatch-tech.jpg',
    category: 'Đồng hồ thông minh',
    rating: 4.5,
    reviews: 98,
  },
  {
    id: 6,
    name: 'Camera 4K Ultra',
    price: '18,999,000',
    originalPrice: '24,999,000',
    discount: '24%',
    image: '/camera-professional.jpg',
    category: 'Camera',
    rating: 4.9,
    reviews: 267,
  },
  {
    id: 7,
    name: 'Gaming Mouse RGB',
    price: '1,499,000',
    originalPrice: '1,999,000',
    discount: '25%',
    image: '/mouse-gaming.jpg',
    category: 'Phụ kiện',
    rating: 4.7,
    reviews: 134,
  },
  {
    id: 8,
    name: 'Mechanical Keyboard',
    price: '2,999,000',
    originalPrice: '3,999,000',
    discount: '25%',
    image: '/keyboard-mechanical.jpg',
    category: 'Phụ kiện',
    rating: 4.8,
    reviews: 201,
  },
]

const categories = ['Tất cả', 'Laptop', 'Điện thoại', 'Tai nghe', 'Máy tính bảng', 'Phụ kiện']

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [sortBy, setSortBy] = useState('newest')
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const filteredProducts =
    selectedCategory === 'Tất cả'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">Tất cả sản phẩm</h1>
            <p className="text-muted-foreground">
              Khám phá {filteredProducts.length} sản phẩm điện tử chất lượng cao
            </p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar - Desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-card rounded-lg p-6 sticky top-24">
                <h3 className="font-semibold mb-4 text-card-foreground">Danh mục</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-input'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Button */}
              <div className="md:hidden mb-4 flex gap-2">
                <Button
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Lọc
                </Button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-input rounded-lg bg-background"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>

              {/* Mobile Filter Panel */}
              {showMobileFilter && (
                <div className="md:hidden bg-card rounded-lg p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Danh mục</h3>
                    <button onClick={() => setShowMobileFilter(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat)
                          setShowMobileFilter(false)
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                          selectedCategory === cat
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-input'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Desktop Sort */}
              <div className="hidden md:flex justify-between items-center mb-6 pb-6 border-b border-border">
                <p className="text-muted-foreground">
                  Hiển thị {filteredProducts.length} sản phẩm
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-input rounded-lg bg-background"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                      <div className="relative bg-muted h-64 flex items-center justify-center overflow-hidden group">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        {product.discount && (
                          <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
                            -{product.discount}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                        <h3 className="font-semibold text-lg mb-3 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            <span className="text-sm font-semibold">{product.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">({product.reviews})</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-primary">{product.price}đ</span>
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
