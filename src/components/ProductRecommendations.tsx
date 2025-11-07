import { useState, useEffect } from "react";
import { Sparkles, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { useCart } from "../context/CartContext";

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  vendor: string;
  image?: string;
  category?: string;
  popularity: number;
}

interface ProductRecommendationsProps {
  userId?: string;
  location?: string;
  limit?: number;
}

export function ProductRecommendations({ 
  userId, 
  location, 
  limit = 6 
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchRecommendations();
  }, [userId, location, limit]);

  const fetchRecommendations = async () => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);
      if (location) params.append("location", location);
      params.append("limit", limit.toString());

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-08603d78/ai/recommendations?${params}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: RecommendedProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      vendor: product.vendor,
      image: product.image,
      quantity: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl">Recommended For You</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl">Recommended For You</h2>
        <span className="text-sm text-gray-500 ml-auto">
          Based on popular choices
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recommendations.map((product) => (
          <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative aspect-square bg-gray-100">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                  <ShoppingCart className="h-12 w-12 text-green-300" />
                </div>
              )}
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Popular
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-sm line-clamp-2 mb-1">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2">{product.vendor}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-600">₹{product.price}</span>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  className="h-7 text-xs bg-green-600 hover:bg-green-700"
                >
                  Add
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
