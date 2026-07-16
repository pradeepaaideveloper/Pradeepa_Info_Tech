import api from './api';

export const authEndpoints = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  verifyEmail: (token: string) => api.post(`/auth/verify-email?token=${token}`),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (payload: any) => api.post('/auth/reset-password', payload),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profile: any) => api.put('/auth/profile', profile),
};

export const courseEndpoints = {
  list: (params?: any) => api.get('/courses', { params }),
  get: (id: number) => api.get(`/courses/${id}`),
  create: (courseData: any) => api.post('/courses', courseData),
  update: (id: number, courseData: any) => api.put(`/courses/${id}`, courseData),
  registerStudent: (formData: any) => api.post('/students/register', formData),
  getStudentProfile: () => api.get('/students/profile'),
  getAttendance: () => api.get('/students/attendance'),
  getFees: () => api.get('/students/fees'),
  getCertificates: () => api.get('/students/certificates'),
};

export const productEndpoints = {
  list: (params?: any) => api.get('/products', { params }),
  search: (query: string) => api.get('/products/search', { params: { q: query } }),
  get: (id: number) => api.get(`/products/${id}`),
  create: (productData: any) => api.post('/products', productData),
  update: (id: number, productData: any) => api.put(`/products/${id}`, productData),
  getLowStockAlerts: () => api.get('/admin/inventory/alerts'),
};

export const cartEndpoints = {
  get: () => api.get('/cart'),
  addItem: (itemId: number, quantity: number) => api.post('/cart/items', { product_id: itemId, quantity }),
  updateItem: (id: number, quantity: number) => api.put(`/cart/items/${id}`, { quantity }),
  removeItem: (id: number) => api.delete(`/cart/items/${id}`),
};

export const checkoutEndpoints = {
  createOrder: (orderData: any) => api.post('/orders', orderData),
  verifyPayment: (paymentDetails: any) => api.post('/orders/verify-payment', paymentDetails),
  getOrders: () => api.get('/orders'),
  downloadInvoice: (orderId: number) => api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' }),
};

export const posEndpoints = {
  submitBill: (billData: any) => api.post('/pos/bills', billData),
  getProductByBarcode: (barcode: string) => api.get(`/pos/products/barcode/${barcode}`),
  downloadReceipt: (billId: number) => api.get(`/pos/bills/${billId}/receipt`, { responseType: 'blob' }),
};

export const chatbotEndpoints = {
  query: (message: string) => api.post('/chatbot/query', { message }),
};
