'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Star, Zap, Shield } from 'lucide-react'

const featuredProducts = [
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
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Thiết bị điện tử chất lượng cao
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 text-balance">
            Khám phá bộ sưu tập hoàn chỉnh các sản phẩm công nghệ mới nhất với giá tốt nhất
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-accent-foreground text-accent hover:opacity-90">
              Xem tất cả sản phẩm
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-lg p-3 mt-1">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Giao hàng nhanh</h3>
                <p className="text-muted-foreground">
                  Giao hàng trong 24-48 giờ đến toàn bộ các tỉnh thành
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-lg p-3 mt-1">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Bảo hành chính hãng</h3>
                <p className="text-muted-foreground">
                  Tất cả sản phẩm đều có bảo hành chính hãng từ nhà sản xuất
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-lg p-3 mt-1">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Giá tốt nhất</h3>
                <p className="text-muted-foreground">
                  Cam k承 giá tốt nhất thị trường, nếu rẻ hơn chúng tôi hoàn tiền
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-balance">
            Sản phẩm nổi bật
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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
                    <h3 className="font-semibold text-lg mb-3 line-clamp-2 text-card-foreground">
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
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Đăng ký nhận bản tin
          </h2>
          <p className="text-lg opacity-90 mb-8 text-balance">
            Nhận thông báo về các sản phẩm mới và ưu đãi đặc biệt
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground text-foreground placeholder-muted-foreground"
            />
            <Button className="bg-accent text-accent-foreground hover:opacity-90">
              Đăng ký
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
