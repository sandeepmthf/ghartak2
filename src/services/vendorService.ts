import { API_ENDPOINTS } from '../config/api';
import { get } from './api';
import { Vendor, Product } from '../types';

export interface VendorsResponse {
  success: boolean;
  count: number;
  data: Vendor[];
}

export interface VendorResponse {
  success: boolean;
  data: Vendor;
}

export interface ProductsResponse {
  success: boolean;
  vendor: {
    id: string;
    name: string;
  };
  count: number;
  data: Product[];
}

export const vendorService = {
  // Get all vendors
  getAllVendors: async (params?: { category?: string; location?: string }): Promise<VendorsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.location) queryParams.append('location', params.location);
    
    const query = queryParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.VENDORS.GET_ALL}?${query}` : API_ENDPOINTS.VENDORS.GET_ALL;
    
    return get<VendorsResponse>(endpoint);
  },

  // Get vendor by ID
  getVendorById: async (vendorId: string): Promise<VendorResponse> => {
    return get<VendorResponse>(API_ENDPOINTS.VENDORS.GET_BY_ID(vendorId));
  },

  // Get vendor products
  getVendorProducts: async (vendorId: string): Promise<ProductsResponse> => {
    return get<ProductsResponse>(API_ENDPOINTS.VENDORS.GET_PRODUCTS(vendorId));
  },
};
