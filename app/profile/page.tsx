'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Edit2, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me')
        const result = await response.json()

        if (result.success) {
          setUserData(result.data)
          setFormData({
            name: result.data.user.name || '',
            email: result.data.user.email || '',
            phone: result.data.user.phone || '',
            address: result.data.user.address || '',
          })
        } else {
          toast.error('Không thể tải thông tin người dùng')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        toast.error('Lỗi khi tải thông tin người dùng')
      } finally {
        setIsLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchUserData()
    }
  }, [status])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Cập nhật thông tin thành công!')
        setUserData({
          ...userData,
          user: result.data,
        })
        setIsEditing(false)
      } else {
        toast.error(result.message || 'Không thể cập nhật thông tin')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Lỗi khi cập nhật thông tin')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Đang tải...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Thông tin cá nhân</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="md:col-span-2">
              <div className="bg-card rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Thông tin tài khoản</h2>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? 'outline' : 'default'}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                  </Button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Họ tên</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border border-input rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Email không thể thay đổi</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Địa chỉ</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground">
                      Lưu thay đổi
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 py-3 border-b border-border">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-semibold">{formData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-3 border-b border-border">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Số điện thoại</p>
                        <p className="font-semibold">{formData.phone || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-3 border-b border-border">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Địa chỉ</p>
                        <p className="font-semibold">{formData.address || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-6 text-center">
                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold mb-1">{formData.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {userData.user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                </p>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </Button>
              </div>

              <div className="bg-card rounded-lg p-6">
                <h3 className="font-semibold mb-4">Thống kê</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Đơn hàng</p>
                    <p className="text-2xl font-bold text-primary">{userData.stats.orderCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(userData.stats.totalSpent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Điểm tích lũy</p>
                    <p className="text-2xl font-bold text-primary">
                      {userData.stats.points.toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
