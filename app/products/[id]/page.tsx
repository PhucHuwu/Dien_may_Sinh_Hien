'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, Truck, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'sonner'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice: number
  discount?: string
  image: string
  category: string
  rating: number
  reviews: number
  description?: string
  specifications?: Record<string, string>
  stock: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${params.id}`)
        const result = await response.json()

        if (result.success) {
          setProduct(result.data)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: quantity,
    })

    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
            <Link href="/products">
              <Button>Quay lại trang sản phẩm</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Convert specifications object to array
  const specifications = product.specifications
    ? Object.entries(product.specifications).map(([label, value]) => ({ label, value }))
    : []

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
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Images Section */}
            <div>
              <div className="bg-muted rounded-lg mb-4 h-96 md:h-full overflow-hidden flex items-center justify-center">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details Section */}
            <div>
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <h1 className="text-2xl md:text-3xl font-bold text-balance mb-2">
                      {product.name}
                    </h1>
                  </div>
                  {product.discount && (
                    <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-semibold">
                      -{product.discount}
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
                            i < Math.floor(product.rating)
                              ? 'fill-accent text-accent'
                              : 'text-border'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({product.reviews} đánh giá)</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Giá đã bao gồm VAT</p>
              </div>

              {/* Availability & Warranty */}
              <div className="mb-6 pb-6 border-b border-border space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm">Bảo hành 24 tháng chính hãng</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-sm">Giao hàng miễn phí toàn quốc</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm">
                    {product.stock > 0 ? (
                      <span className="text-green-600">Còn {product.stock} sản phẩm</span>
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
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:bg-muted"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
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

          {/* Specifications & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {specifications.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Thông số kỹ thuật</h2>
                <div className="space-y-3">
                  {specifications.map((spec, idx) => (
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
            )}

            {product.description && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Mô tả sản phẩm</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
