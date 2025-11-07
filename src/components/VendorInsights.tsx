import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  AlertCircle,
  BarChart3,
  Calendar,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface VendorInsightsProps {
  vendorId: string;
}

interface ProductStat {
  productId: string;
  name: string;
  totalSold: number;
  revenue: number;
  lastOrderDate: string;
  category: string;
}

interface Insights {
  totalOrders: number;
  totalRevenue: number;
  topSellingProducts: ProductStat[];
  topRevenueProducts: ProductStat[];
  restockSuggestions: ProductStat[];
  productStats: ProductStat[];
}

interface Prediction {
  productName: string;
  averageDailySales: number;
  predictedNextWeekSales: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export function VendorInsights({ vendorId }: VendorInsightsProps) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'predictions'>('overview');

  useEffect(() => {
    fetchInsights();
    fetchPredictions();
  }, [vendorId]);

  const fetchInsights = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-08603d78/ai/vendor-insights/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setInsights(data.insights);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPredictions = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-08603d78/ai/demand-prediction/${vendorId}?days=30`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setPredictions(data.predictions);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No insights available yet.</p>
          <p className="text-sm mt-1">Start receiving orders to see analytics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.totalOrders}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{insights.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Products Sold</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.productStats.length}</div>
            <p className="text-xs text-gray-500 mt-1">Unique products</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            selectedTab === 'overview'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedTab('predictions')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            selectedTab === 'predictions'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Demand Predictions
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            fetchInsights();
            fetchPredictions();
          }}
          className="ml-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.topSellingProducts.slice(0, 5).map((product, index) => (
                  <div key={product.productId} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{product.totalSold} sold</p>
                      <p className="text-xs text-gray-500">₹{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Restock Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Restock Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insights.restockSuggestions.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">All products are selling well!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {insights.restockSuggestions.map((product) => (
                    <div key={product.productId} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                          Low Activity
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          Last order: {formatDate(product.lastOrderDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{product.totalSold} sold</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Predictions Tab */}
      {selectedTab === 'predictions' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              7-Day Demand Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            {predictions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Not enough data for predictions yet.</p>
                <p className="text-sm mt-1">Collect more order history to see forecasts.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {predictions.map((pred, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{pred.productName}</p>
                      <p className="text-xs text-gray-500">
                        Avg: {pred.averageDailySales.toFixed(1)} units/day
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">
                        {pred.predictedNextWeekSales} units
                      </p>
                      <p className="text-xs text-gray-500">Next 7 days</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
