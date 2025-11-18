import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

// GET - Lấy danh sách sản phẩm
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy');

    let query = {};
    if (category && category !== 'Tất cả') {
      query = { category };
    }

    let products = Product.find(query);

    // Sắp xếp
    switch (sortBy) {
      case 'price-low':
        products = products.sort({ price: 1 });
        break;
      case 'price-high':
        products = products.sort({ price: -1 });
        break;
      case 'rating':
        products = products.sort({ rating: -1 });
        break;
      default:
        products = products.sort({ createdAt: -1 });
    }

    const result = await products.exec();

    return NextResponse.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Không thể lấy danh sách sản phẩm',
      },
      { status: 500 }
    );
  }
}

// POST - Tạo sản phẩm mới (chỉ admin)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const product = await Product.create(body);

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Không thể tạo sản phẩm',
      },
      { status: 400 }
    );
  }
}
