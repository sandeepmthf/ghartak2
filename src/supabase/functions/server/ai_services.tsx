// AI Services for Ghartak
import * as kv from "./kv_store.tsx";

// ==================== RECOMMENDATION ENGINE ====================

/**
 * Generate personalized product recommendations based on:
 * - User's previous orders
 * - Popular products in their location
 * - Seasonal trends
 */
export async function generateRecommendations(userId?: string, location?: string, limit = 6) {
  try {
    const orders = await kv.getByPrefix("order:");
    
    // If user has order history, use collaborative filtering
    let userOrderedProducts: any[] = [];
    if (userId) {
      const userOrders = orders.filter(o => o.userId === userId);
      userOrderedProducts = userOrders.flatMap(order => 
        order.cart?.map((item: any) => item.id) || []
      );
    }
    
    // Calculate product popularity (frequency in orders)
    const productFrequency: Record<string, number> = {};
    const productDetails: Record<string, any> = {};
    
    orders.forEach(order => {
      if (location && order.address?.city !== location) {
        return; // Filter by location if provided
      }
      
      order.cart?.forEach((item: any) => {
        const productId = item.id;
        productFrequency[productId] = (productFrequency[productId] || 0) + 1;
        
        if (!productDetails[productId]) {
          productDetails[productId] = {
            id: item.id,
            name: item.name,
            price: item.price,
            vendor: item.vendor,
            image: item.image,
            category: item.category,
          };
        }
      });
    });
    
    // Exclude products user has already ordered
    const recommendedProducts = Object.entries(productFrequency)
      .filter(([productId]) => !userOrderedProducts.includes(productId))
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([productId]) => ({
        ...productDetails[productId],
        popularity: productFrequency[productId],
      }));
    
    // If we don't have enough recommendations, add seasonal/trending items
    if (recommendedProducts.length < limit) {
      const fallbackProducts = Object.entries(productFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([productId]) => ({
          ...productDetails[productId],
          popularity: productFrequency[productId],
        }));
      
      return fallbackProducts;
    }
    
    return recommendedProducts;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [];
  }
}

// ==================== VENDOR INSIGHTS ====================

/**
 * Generate insights for vendors about their products
 * - Top selling products
 * - Products that need restocking
 * - Demand predictions
 */
export async function generateVendorInsights(vendorId: string) {
  try {
    const orders = await kv.getByPrefix("order:");
    
    // Filter orders containing products from this vendor
    const vendorOrders = orders.filter(order => 
      order.cart?.some((item: any) => item.vendor === vendorId)
    );
    
    // Calculate product statistics
    const productStats: Record<string, {
      name: string;
      totalSold: number;
      revenue: number;
      lastOrderDate: string;
      category: string;
    }> = {};
    
    vendorOrders.forEach(order => {
      order.cart?.forEach((item: any) => {
        if (item.vendor === vendorId) {
          const productId = item.id;
          
          if (!productStats[productId]) {
            productStats[productId] = {
              name: item.name,
              totalSold: 0,
              revenue: 0,
              lastOrderDate: order.createdAt,
              category: item.category || "Unknown",
            };
          }
          
          productStats[productId].totalSold += item.quantity || 1;
          productStats[productId].revenue += (item.price || 0) * (item.quantity || 1);
          
          // Update last order date if this order is more recent
          if (new Date(order.createdAt) > new Date(productStats[productId].lastOrderDate)) {
            productStats[productId].lastOrderDate = order.createdAt;
          }
        }
      });
    });
    
    // Convert to array and sort
    const productArray = Object.entries(productStats).map(([id, stats]) => ({
      productId: id,
      ...stats,
    }));
    
    const topSellingProducts = [...productArray]
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10);
    
    const topRevenueProducts = [...productArray]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    // Products that haven't been ordered recently (potential restock needed)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const restockSuggestions = productArray
      .filter(p => new Date(p.lastOrderDate) < thirtyDaysAgo && p.totalSold > 5)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
    
    // Calculate total revenue and order count
    const totalRevenue = vendorOrders.reduce((sum, order) => {
      const vendorItems = order.cart?.filter((item: any) => item.vendor === vendorId) || [];
      const vendorTotal = vendorItems.reduce((itemSum, item) => 
        itemSum + (item.price * (item.quantity || 1)), 0);
      return sum + vendorTotal;
    }, 0);
    
    return {
      totalOrders: vendorOrders.length,
      totalRevenue,
      topSellingProducts,
      topRevenueProducts,
      restockSuggestions,
      productStats: productArray,
    };
  } catch (error) {
    console.error("Error generating vendor insights:", error);
    throw error;
  }
}

// ==================== DEMAND PREDICTION ====================

/**
 * Predict demand for products based on historical data
 */
export async function predictDemand(vendorId: string, days = 30) {
  try {
    const orders = await kv.getByPrefix("order:");
    
    // Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Filter recent orders for this vendor
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const hasVendorProducts = order.cart?.some((item: any) => item.vendor === vendorId);
      return orderDate >= startDate && orderDate <= endDate && hasVendorProducts;
    });
    
    // Calculate daily sales
    const dailySales: Record<string, number> = {};
    
    recentOrders.forEach(order => {
      const dateKey = new Date(order.createdAt).toISOString().split('T')[0];
      
      order.cart?.forEach((item: any) => {
        if (item.vendor === vendorId) {
          const key = `${dateKey}:${item.id}`;
          dailySales[key] = (dailySales[key] || 0) + (item.quantity || 1);
        }
      });
    });
    
    // Simple moving average prediction
    const predictions: Record<string, {
      productName: string;
      averageDailySales: number;
      predictedNextWeekSales: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    }> = {};
    
    // Group by product and calculate average
    Object.entries(dailySales).forEach(([key, quantity]) => {
      const [, productId] = key.split(':');
      
      if (!predictions[productId]) {
        predictions[productId] = {
          productName: productId,
          averageDailySales: 0,
          predictedNextWeekSales: 0,
          trend: 'stable',
        };
      }
      
      predictions[productId].averageDailySales += quantity;
    });
    
    // Calculate averages and predictions
    Object.keys(predictions).forEach(productId => {
      const totalDays = days;
      predictions[productId].averageDailySales /= totalDays;
      predictions[productId].predictedNextWeekSales = 
        Math.round(predictions[productId].averageDailySales * 7);
    });
    
    return Object.values(predictions);
  } catch (error) {
    console.error("Error predicting demand:", error);
    throw error;
  }
}

// ==================== AI CHAT CONTEXT ====================

/**
 * Prepare context for AI chatbot about orders and vendors
 */
export async function getChatContext(userId?: string) {
  try {
    const orders = await kv.getByPrefix("order:");
    
    let userOrders = [];
    if (userId) {
      userOrders = orders.filter(o => o.userId === userId);
    }
    
    // Get available vendors from orders
    const vendors = new Set<string>();
    orders.forEach(order => {
      order.cart?.forEach((item: any) => {
        if (item.vendor) {
          vendors.add(item.vendor);
        }
      });
    });
    
    return {
      totalOrders: orders.length,
      userOrderCount: userOrders.length,
      availableVendors: Array.from(vendors),
      recentOrders: orders.slice(0, 5).map(o => ({
        orderId: o.orderId,
        status: o.status,
        total: o.totalAmount,
        createdAt: o.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error getting chat context:", error);
    return null;
  }
}
