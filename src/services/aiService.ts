import { API_ENDPOINTS } from '../config/api';
import { get, post } from './api';

export interface RecommendationsResponse {
  success: boolean;
  data: {
    recommendations: Array<{
      id: string;
      name: string;
      category: string;
      price: number;
      popularity: number;
      reason: string;
    }>;
    algorithmUsed: string;
    location: string;
  };
}

export interface VendorInsightsResponse {
  success: boolean;
  data: {
    vendorId: string;
    summary: {
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      totalProducts: number;
    };
    topProducts: Array<{
      productId: string;
      productName: string;
      totalQuantity: number;
      totalRevenue: number;
      orderCount: number;
    }>;
    recentTrend: string;
    generatedAt: string;
  };
}

export interface DemandPredictionResponse {
  success: boolean;
  data: {
    vendorId: string;
    predictions: Array<{
      date: string;
      predictedOrders: number;
      predictedRevenue: number;
      confidence: string;
    }>;
    historicalAverage: {
      dailyOrders: string;
      orderValue: string;
    };
    algorithmUsed: string;
    generatedAt: string;
  };
}

export interface ChatResponse {
  success: boolean;
  data: {
    response: string;
    conversationHistory: Array<{
      role: string;
      content: string;
    }>;
  };
}

export const aiService = {
  // Get product recommendations
  getRecommendations: async (params?: {
    userId?: string;
    location?: string;
  }): Promise<RecommendationsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.location) queryParams.append('location', params.location);
    
    const query = queryParams.toString();
    const endpoint = query
      ? `${API_ENDPOINTS.AI.RECOMMENDATIONS}?${query}`
      : API_ENDPOINTS.AI.RECOMMENDATIONS;
    
    return get<RecommendationsResponse>(endpoint);
  },

  // Get vendor insights
  getVendorInsights: async (vendorId: string): Promise<VendorInsightsResponse> => {
    return get<VendorInsightsResponse>(API_ENDPOINTS.AI.VENDOR_INSIGHTS(vendorId));
  },

  // Get demand prediction
  getDemandPrediction: async (vendorId: string): Promise<DemandPredictionResponse> => {
    return get<DemandPredictionResponse>(API_ENDPOINTS.AI.DEMAND_PREDICTION(vendorId));
  },

  // Chat with AI
  chat: async (
    message: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<ChatResponse> => {
    return post<ChatResponse>(API_ENDPOINTS.AI.CHAT, {
      message,
      conversationHistory: conversationHistory || [],
    });
  },
};
