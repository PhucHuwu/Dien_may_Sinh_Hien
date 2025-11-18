'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, Truck, Shield } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const productData = {
  id: 1,
  name: 'Laptop Pro X1 - Hiệu năng đỉnh cao',
  brand: 'TechBrand',
  category: 'Laptop',
  price: '25,999,000',
  originalPrice: '32,999,000',
  discount: '21%',
  rating: 4.8,
  reviews: 245,
  warranty: 24,
  stock: 15,
  images: [
    '/laptop-modern-front.jpg',
    '/laptop-modern-side.jpg',
    '/laptop-modern-back.jpg',
    '/laptop-screen.jpg',
  ],
  description:
    'Laptop Pro X1 là sự lựa chọn hoàn hảo cho những ai tìm kiếm hiệu năng cao và thiết kế tinh tế. Với bộ xử lý mới nhất, pin trâu, và màn hình độ phân giải cao, laptop này sẽ đáp ứng mọi nhu cầu công việc và giải trí của bạn.',
  specifications: [
    { label: 'CPU', value: 'Intel Core i7-13th Gen' },
    { label: 'RAM', value: '16GB DDR5' },
    { label: 'Storage', value: '512GB SSD NVMe' },
    { label: 'Display', value: '15.6" 4K IPS 120Hz' },
    { label: 'GPU', value: 'NVIDIA RTX 4060' },
    { label: 'Pin', value: '6000mAh (20+ giờ)' },
    { label: 'Trọng lượng', value: '1.8kg' },
    { label: 'OS', value: 'Windows 11 Pro' },
  ],
  highlights: [
    'Hiệu năng cao cho gaming và professional work',
    'Màn hình 4K sắc nét với tần số quét 120Hz',
    'Pin trâu lên tới 20+ giờ',
    'Thiết kế mỏng nhẹ, dễ mang theo',
    'Bảo hành chính hãng 24 tháng',
  ],
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-foreground">{productData.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Images Section */}
            <div>
              <div className="bg-muted rounded-lg mb-4 h-96 md:h-full overflow-hidden flex items-center justify-center">
                <img
                  src={productData.images[selectedImage] || "/placeholder.svg"}
                  alt={productData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {productData.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? 'border-primary' : 'border-input'
                    }`}
                  >
                    <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div>
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{productData.category}</p>
                    <h1 className="text-2xl md:text-3xl font-bold text-balance mb-2">
                      {productData.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">Hãng: {productData.brand}</p>
                  </div>
                  {productData.discount && (
                    <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-semibold">
                      -{productData.discount}
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(productData.rating)
                              ? 'fill-accent text-accent'
                              : 'text-border'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{productData.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({productData.reviews} đánh giá)</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    {productData.price}đ
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {productData.originalPrice}đ
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Giá đã bao gồm VAT</p>
              </div>

              {/* Availability & Warranty */}
              <div className="mb-6 pb-6 border-b border-border space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm">Bảo hành {productData.warranty} tháng chính hãng</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-sm">Giao hàng miễn phí toàn quốc</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm">
                    {productData.stock > 0 ? (
                      <span className="text-green-600">Còn {productData.stock} sản phẩm</span>
                    ) : (
                      <span className="text-red-600">Hết hàng</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Số lượng:</span>
                  <div className="flex items-center border border-input rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-muted"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-muted"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={productData.stock === 0}
                    className="flex-1 bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    variant="outline"
                    size="icon"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isWishlisted ? 'fill-current text-red-500' : ''
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Thông số kỹ thuật</h2>
              <div className="space-y-3">
                {productData.specifications.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-3 border-b border-border"
                  >
                    <span className="font-medium text-muted-foreground">{spec.label}</span>
                    <span className="font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Điểm nổi bật</h2>
              <ul className="space-y-3">
                {productData.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center mt-1">
                      <span className="text-xs font-bold">✓</span>
                    </div>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Description */}
          <div className="mt-12 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
            <p className="text-muted-foreground leading-relaxed">{productData.description}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
