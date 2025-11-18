// API helper functions để gọi các endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Products API
export const productsApi = {
  // Lấy danh sách sản phẩm
  getAll: async (params?: { category?: string; sortBy?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.sortBy) query.append('sortBy', params.sortBy);

    const response = await fetch(`${API_BASE_URL}/api/products?${query.toString()}`);
    return response.json();
  },

  // Lấy chi tiết sản phẩm
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    return response.json();
  },

  // Tạo sản phẩm mới (admin)
  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Cập nhật sản phẩm (admin)
  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Xóa sản phẩm (admin)
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Users API
export const usersApi = {
  // Đăng ký tài khoản
  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Orders API
export const ordersApi = {
  // Lấy danh sách đơn hàng
  getAll: async (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    const response = await fetch(`${API_BASE_URL}/api/orders${query}`);
    return response.json();
  },

  // Tạo đơn hàng mới
  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
