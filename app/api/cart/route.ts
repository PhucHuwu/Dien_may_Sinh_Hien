import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import dbConnect from '@/lib/mongodb'
import Cart from '@/models/Cart'
import Product from '@/models/Product'

// GET - Lấy giỏ hàng của user
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

    let cart = await Cart.findOne({ user: (session.user as any).id })

    if (!cart) {
      // Tạo giỏ hàng mới nếu chưa có
      cart = await Cart.create({
        user: (session.user as any).id,
        items: [],
      })
    }

    return NextResponse.json({
      success: true,
      data: cart,
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching cart',
      },
      { status: 500 }
    )
  }
}

// POST - Thêm sản phẩm vào giỏ hàng
export async function POST(request: NextRequest) {
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
    const { productId, quantity } = body

    // Kiểm tra sản phẩm có tồn tại
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found',
        },
        { status: 404 }
      )
    }

    // Kiểm tra số lượng tồn kho
    if (quantity > product.stock) {
      return NextResponse.json(
        {
          success: false,
          message: `Chỉ còn ${product.stock} sản phẩm trong kho`,
        },
        { status: 400 }
      )
    }

    let cart = await Cart.findOne({ user: (session.user as any).id })

    if (!cart) {
      // Tạo giỏ hàng mới
      cart = await Cart.create({
        user: (session.user as any).id,
        items: [
          {
            product: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            stock: product.stock,
          },
        ],
      })
    } else {
      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      )

      if (existingItemIndex > -1) {
        // Cập nhật số lượng
        const newQuantity = cart.items[existingItemIndex].quantity + quantity

        if (newQuantity > product.stock) {
          return NextResponse.json(
            {
              success: false,
              message: `Chỉ còn ${product.stock} sản phẩm trong kho`,
            },
            { status: 400 }
          )
        }

        cart.items[existingItemIndex].quantity = newQuantity
      } else {
        // Thêm sản phẩm mới
        cart.items.push({
          product: productId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          stock: product.stock,
        })
      }

      await cart.save()
    }

    return NextResponse.json({
      success: true,
      message: 'Product added to cart',
      data: cart,
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error adding to cart',
      },
      { status: 500 }
    )
  }
}

// PUT - Cập nhật số lượng sản phẩm trong giỏ
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
    const { productId, quantity } = body

    const cart = await Cart.findOne({ user: (session.user as any).id })

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cart not found',
        },
        { status: 404 }
      )
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    )

    if (itemIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found in cart',
        },
        { status: 404 }
      )
    }

    // Kiểm tra số lượng tồn kho
    const product = await Product.findById(productId)
    if (quantity > product.stock) {
      return NextResponse.json(
        {
          success: false,
          message: `Chỉ còn ${product.stock} sản phẩm trong kho`,
        },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      // Xóa sản phẩm nếu số lượng <= 0
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }

    await cart.save()

    return NextResponse.json({
      success: true,
      message: 'Cart updated',
      data: cart,
    })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating cart',
      },
      { status: 500 }
    )
  }
}

// DELETE - Xóa sản phẩm khỏi giỏ hàng
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product ID is required',
        },
        { status: 400 }
      )
    }

    const cart = await Cart.findOne({ user: (session.user as any).id })

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cart not found',
        },
        { status: 404 }
      )
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId)
    await cart.save()

    return NextResponse.json({
      success: true,
      message: 'Product removed from cart',
      data: cart,
    })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error removing from cart',
      },
      { status: 500 }
    )
  }
}
