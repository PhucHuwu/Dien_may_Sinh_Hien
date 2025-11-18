import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone, password } = await req.json()

    // Validate input
    if (!email || !name || !phone || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    await dbConnect()

    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await User.findOne({ email })

    if (existingUser && existingUser.password) {
      // User đã có password rồi -> không cho phép đăng ký lại
      return NextResponse.json(
        { success: false, message: 'Tài khoản đã tồn tại và đã được kích hoạt' },
        { status: 400 }
      )
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    if (existingUser) {
      // User đã tồn tại (từ Google) nhưng chưa có password -> cập nhật
      existingUser.password = hashedPassword
      existingUser.phone = phone
      existingUser.name = name
      existingUser.isGoogleRegistrationComplete = true
      await existingUser.save()
    } else {
      // Tạo user mới hoàn toàn
      await User.create({
        email,
        name,
        phone,
        password: hashedPassword,
        role: 'user',
        isGoogleRegistrationComplete: true,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Hoàn tất đăng ký thành công',
    })
  } catch (error: any) {
    console.error('Complete registration error:', error)

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Email đã được sử dụng' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
