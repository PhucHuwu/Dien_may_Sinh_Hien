'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Phone, Eye, EyeOff, Mail, User } from 'lucide-react'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

function CompleteRegistrationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Lấy thông tin từ query params
    const email = searchParams.get('email')
    const name = searchParams.get('name')

    if (email && name) {
      setFormData(prev => ({
        ...prev,
        email: decodeURIComponent(email),
        name: decodeURIComponent(name),
      }))
    } else {
      // Nếu không có thông tin -> redirect về trang đăng nhập
      toast.error('Thông tin không hợp lệ')
      router.push('/auth/login')
    }
  }, [searchParams, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu không trùng khớp')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/users/complete-google-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Hoàn tất đăng ký thành công! Đang đăng nhập...')

        // Đăng nhập sau khi hoàn tất đăng ký
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (signInResult?.error) {
          toast.error('Đăng nhập thất bại, vui lòng đăng nhập thủ công')
          router.push('/auth/login')
        } else {
          router.push('/')
          router.refresh()
        }
      } else {
        toast.error(result.message || 'Hoàn tất đăng ký thất bại')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-lg p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold mb-2 text-card-foreground">
                Hoàn tất đăng ký
              </h1>
              <p className="text-muted-foreground">
                Bạn đã đăng nhập bằng Google. Vui lòng bổ sung thêm thông tin để hoàn tất đăng ký.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-card-foreground">
                  Họ tên
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-card-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-card-foreground">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0912345678"
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-card-foreground">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-card-foreground">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:opacity-90"
              >
                {isLoading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                Bằng cách hoàn tất đăng ký, bạn đồng ý với{' '}
                <a href="/terms" className="text-primary hover:underline">
                  Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  Chính sách bảo mật
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function CompleteRegistrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-lg shadow-lg p-8">
              <div className="text-center">
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <CompleteRegistrationForm />
    </Suspense>
  )
}
