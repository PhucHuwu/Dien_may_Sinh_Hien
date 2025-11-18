'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Edit2, LogOut } from 'lucide-react'
import { useState } from 'react'

const userData = {
  fullname: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0912345678',
  addresses: [
    {
      id: 1,
      name: 'Nhà riêng',
      address: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Công ty',
      address: '456 Đường DEF, Phường UVW, Quận 3, TP.HCM',
      isDefault: false,
    },
  ],
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullname: userData.fullname,
    email: userData.email,
    phone: userData.phone,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Họ tên</label>
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
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
                        <p className="font-semibold">{formData.phone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Addresses */}
              <div className="bg-card rounded-lg p-6 mt-6">
                <h2 className="text-2xl font-bold mb-6">Địa chỉ giao hàng</h2>
                <div className="space-y-4">
                  {userData.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="border border-input rounded-lg p-4 flex items-start justify-between"
                    >
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            {address.name}
                            {address.isDefault && (
                              <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                                Mặc định
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{address.address}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Chỉnh sửa
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Thêm địa chỉ mới
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-6 text-center">
                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  N
                </div>
                <h3 className="text-xl font-bold mb-1">{formData.fullname}</h3>
                <p className="text-sm text-muted-foreground mb-4">Thành viên VIP</p>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </Button>
              </div>

              <div className="bg-card rounded-lg p-6">
                <h3 className="font-semibold mb-4">Thống kê</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Đơn hàng</p>
                    <p className="text-2xl font-bold text-primary">12</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                    <p className="text-2xl font-bold text-primary">250M đ</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Điểm tích lũy</p>
                    <p className="text-2xl font-bold text-primary">2,500</p>
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
