import { API_ENDPOINTS } from '../config/api';
import { post, get, patch } from './api';
import { CartItem, Order } from '../types';

export interface CreateOrderData {
  vendorId: string;
  items: CartItem[];
  total: number;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  data: Order;
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  data: Order[];
}

export const orderService = {
  // Create order
  createOrder: async (data: CreateOrderData): Promise<OrderResponse> => {
    return post<OrderResponse>(API_ENDPOINTS.ORDERS.CREATE, data);
  },

  // Get all orders
  getAllOrders: async (params?: {
    vendorId?: string;
    status?: string;
    customerPhone?: string;
  }): Promise<OrdersResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.vendorId) queryParams.append('vendorId', params.vendorId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.customerPhone) queryParams.append('customerPhone', params.customerPhone);
    
    const query = queryParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.ORDERS.GET_ALL}?${query}` : API_ENDPOINTS.ORDERS.GET_ALL;
    
    return get<OrdersResponse>(endpoint);
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<OrderResponse> => {
    return get<OrderResponse>(API_ENDPOINTS.ORDERS.GET_BY_ID(orderId));
  },

  // Update order status
  updateOrderStatus: async (
    orderId: string,
    status: string
  ): Promise<OrderResponse> => {
    return patch<OrderResponse>(API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), { status });
  },
};
