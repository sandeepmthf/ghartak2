// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    PROFILE: '/api/auth/profile',
    UPDATE_PROFILE: '/api/auth/profile',
  },
  // Orders
  ORDERS: {
    CREATE: '/api/orders',
    GET_ALL: '/api/orders',
    GET_BY_ID: (id: string) => `/api/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/api/orders/${id}`,
  },
  // Payments
  PAYMENT: {
    CREATE_RAZORPAY: '/api/payment/create-razorpay-order',
    VERIFY_RAZORPAY: '/api/payment/verify-razorpay',
    CONFIRM_COD: '/api/payment/confirm-cod',
    STATS: '/api/payment/stats',
  },
  // AI
  AI: {
    RECOMMENDATIONS: '/api/ai/recommendations',
    VENDOR_INSIGHTS: (vendorId: string) => `/api/ai/vendor-insights/${vendorId}`,
    DEMAND_PREDICTION: (vendorId: string) => `/api/ai/demand-prediction/${vendorId}`,
    CHAT: '/api/ai/chat',
  },
  // Vendors
  VENDORS: {
    GET_ALL: '/api/vendors',
    GET_BY_ID: (vendorId: string) => `/api/vendors/${vendorId}`,
    GET_PRODUCTS: (vendorId: string) => `/api/vendors/${vendorId}/products`,
  },
};

// Helper to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('ghartak_access_token');
};

// Helper to set auth headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
