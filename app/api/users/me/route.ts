import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'

// GET - Lấy thông tin user hiện tại
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    await dbConnect()

    const user = await User.findById((session.user as any).id).select('-password')

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      )
    }

    // Lấy thống kê đơn hàng
    const orders = await Order.find({ user: user._id })
    const orderCount = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0)

    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          createdAt: user.createdAt,
        },
        stats: {
          orderCount,
          totalSpent,
          points: Math.floor(totalSpent / 100000), // 1 điểm = 100,000đ
        },
      },
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching profile',
      },
      { status: 500 }
    )
  }
}

// PUT - Cập nhật thông tin user
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    await dbConnect()

    const body = await request.json()
    const { name, phone, address } = body

    const user = await User.findByIdAndUpdate(
      (session.user as any).id,
      {
        name,
        phone,
        address,
      },
      {
        new: true,
        runValidators: true,
        select: '-password',
      }
    )

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Error updating profile',
      },
      { status: 400 }
    )
  }
}
