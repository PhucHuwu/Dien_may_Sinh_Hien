import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

// GET - Lấy danh sách đơn hàng
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let query = {};
    if (userId) {
      query = { user: userId };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Không thể lấy danh sách đơn hàng',
      },
      { status: 500 }
    );
  }
}

// POST - Tạo đơn hàng mới
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const order = await Order.create(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Đặt hàng thành công',
        data: order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Không thể tạo đơn hàng',
      },
      { status: 400 }
    );
  }
}
