import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

// API test endpoint để kiểm tra kết nối MongoDB
export async function GET() {
  try {
    await dbConnect();

    const productsCount = await Product.countDocuments();

    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      data: {
        productsCount,
        status: 'connected',
      },
    });
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'MongoDB connection failed',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
