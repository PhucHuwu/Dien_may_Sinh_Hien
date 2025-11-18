import mongoose, { Schema, models } from 'mongoose';

export interface IProduct {
  name: string;
  price: number;
  originalPrice: number;
  discount?: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description?: string;
  specifications?: Record<string, string>;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá sản phẩm'],
      min: [0, 'Giá không được âm'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'Vui lòng nhập giá gốc'],
      min: [0, 'Giá không được âm'],
    },
    discount: {
      type: String,
    },
    image: {
      type: String,
      required: [true, 'Vui lòng thêm hình ảnh sản phẩm'],
    },
    category: {
      type: String,
      required: [true, 'Vui lòng chọn danh mục'],
      enum: ['Laptop', 'Điện thoại', 'Tai nghe', 'Máy tính bảng', 'Đồng hồ thông minh', 'Camera', 'Phụ kiện'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating tối thiểu là 0'],
      max: [5, 'Rating tối đa là 5'],
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, 'Số reviews không được âm'],
    },
    description: {
      type: String,
    },
    specifications: {
      type: Map,
      of: String,
    },
    stock: {
      type: Number,
      required: [true, 'Vui lòng nhập số lượng tồn kho'],
      min: [0, 'Số lượng không được âm'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
