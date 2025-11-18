import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">TechStore</h3>
            <p className="text-sm opacity-90 mb-4">
              Cung cấp thiết bị điện tử chất lượng cao với giá cạnh tranh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:underline">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:underline">
                  Trợ giúp
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1900 1234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@techstore.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground border-opacity-30 pt-8 text-center text-sm opacity-90">
          <p>&copy; 2025 TechStore. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
