# Hướng dẫn thiết lập MongoDB cho Điện Máy Sinh Hiền

## 📋 Tổng quan

Dự án đã được thiết lập để sử dụng MongoDB làm cơ sở dữ liệu. Bạn có thể sử dụng MongoDB local hoặc MongoDB Atlas (cloud).

## 🚀 Cài đặt

### 1. Cài đặt MongoDB

#### Option A: MongoDB Local (Khuyến nghị cho phát triển)

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
- Download từ: https://www.mongodb.com/try/download/community
- Cài đặt và khởi động MongoDB Service

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb
```

#### Option B: MongoDB Atlas (Cloud - Miễn phí)

1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Đăng ký tài khoản miễn phí
3. Tạo cluster mới
4. Tạo database user
5. Whitelist IP address (0.0.0.0/0 cho development)
6. Lấy connection string

### 2. Cấu hình Environment Variables

File `.env.local` đã được tạo sẵn. Bạn cần cập nhật connection string:

**Cho MongoDB Local:**
```env
MONGODB_URI=mongodb://localhost:27017/dien-may-sinh-hien
```

**Cho MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/dien-may-sinh-hien?retryWrites=true&w=majority
```

Thay thế:
- `<username>`: Username của database user
- `<password>`: Password của database user
- `<cluster-url>`: Cluster URL từ MongoDB Atlas

## 📦 Cấu trúc Database

### Models đã tạo:

#### 1. Product (Sản phẩm)
```typescript
{
  name: string
  price: number
  originalPrice: number
  discount?: string
  image: string
  category: string
  rating: number
  reviews: number
  description?: string
  specifications?: object
  stock: number
}
```

#### 2. User (Người dùng)
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  phone?: string
  address?: string
  role: 'user' | 'admin'
}
```

#### 3. Order (Đơn hàng)
```typescript
{
  user: ObjectId
  orderItems: [...]
  shippingAddress: {...}
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: boolean
  isDelivered: boolean
  status: string
}
```

## 🌱 Seed Database

Thêm dữ liệu mẫu vào database:

```bash
pnpm run seed
```

Script này sẽ:
- Xóa dữ liệu cũ (nếu có)
- Thêm 8 sản phẩm mẫu với đầy đủ thông tin

## 🔌 API Routes

### Products

**GET /api/products**
- Lấy danh sách sản phẩm
- Query params: `category`, `sortBy`

**POST /api/products**
- Tạo sản phẩm mới (admin)

**GET /api/products/[id]**
- Lấy chi tiết sản phẩm

**PUT /api/products/[id]**
- Cập nhật sản phẩm (admin)

**DELETE /api/products/[id]**
- Xóa sản phẩm (admin)

### Users

**POST /api/users/register**
- Đăng ký tài khoản mới
- Body: `{ name, email, password, phone?, address? }`

### Orders

**GET /api/orders**
- Lấy danh sách đơn hàng
- Query params: `userId`

**POST /api/orders**
- Tạo đơn hàng mới

## 🧪 Test API

Sử dụng các công cụ như:
- Postman
- Thunder Client (VS Code extension)
- cURL

**Ví dụ tạo sản phẩm:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 1000000,
    "originalPrice": 1500000,
    "discount": "33%",
    "image": "/test.jpg",
    "category": "Laptop",
    "rating": 4.5,
    "reviews": 10,
    "stock": 50
  }'
```

## 🔒 Bảo mật

- Password được hash bằng bcryptjs
- File `.env.local` đã được thêm vào `.gitignore`
- KHÔNG commit file `.env.local` lên Git

## 📝 Các bước tiếp theo

1. ✅ Cài đặt MongoDB (local hoặc Atlas)
2. ✅ Cập nhật MONGODB_URI trong `.env.local`
3. ✅ Chạy `pnpm run seed` để thêm dữ liệu mẫu
4. ✅ Chạy `pnpm dev` để khởi động server
5. 🔄 Test API endpoints
6. 🔄 Tích hợp API vào frontend
7. 🔄 Thêm authentication (JWT/NextAuth)
8. 🔄 Thêm authorization middleware

## ⚠️ Lưu ý

- Database hiện tại chưa có authentication/authorization
- Cần thêm middleware để bảo vệ các route admin
- Cần implement JWT hoặc NextAuth.js cho authentication
- Cần validate input data trước khi lưu vào database
- Cần thêm error handling và logging

## 📚 Tài liệu tham khảo

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
