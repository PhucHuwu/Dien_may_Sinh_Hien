import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password, phone, address } = await request.json();

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email đã được sử dụng',
        },
        { status: 400 }
      );
    }

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
    });

    // Không trả về password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Đăng ký thành công',
        data: userResponse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Không thể đăng ký tài khoản',
      },
      { status: 500 }
    );
  }
}
