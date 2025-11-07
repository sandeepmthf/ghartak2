import { useState } from 'react';
import { Star, MapPin, Clock, DollarSign, ShoppingCart, Plus, Minus, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useCart } from '../context/CartContext';
import { mockVendors, mockProducts } from '../data/mockData';
import { toast } from 'sonner@2.0.3';

interface VendorDetailPageProps {
  vendorId: string;
  onNavigate: (page: string) => void;
}

export default function VendorDetailPage({ vendorId, onNavigate }: VendorDetailPageProps) {
  const { addToCart, cart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const vendor = mockVendors.find(v => v.id === vendorId);
  const products = mockProducts[vendorId] || [];

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Vendor not found</h2>
          <Button onClick={() => onNavigate('vendors')}>Back to Vendors</Button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta)
    }));
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const quantity = quantities[productId] || 1;
    addToCart(product, vendorId, quantity);
    toast.success(`${product.name} added to cart!`);
    setQuantities(prev => ({ ...prev, [productId]: 0 }));
  };

  const categorizeProducts = () => {
    const categories: Record<string, typeof products> = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });
    return categories;
  };

  const categorizedProducts = categorizeProducts();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('vendors')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Vendors
          </Button>
        </div>
      </div>

      {/* Vendor Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={vendor.image} 
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl mb-2 text-gray-900">{vendor.name}</h1>
                  <p className="text-gray-600">{vendor.category}</p>
                </div>
                <div className="flex items-center gap-1 bg-green-50 px-3 py-2 rounded-lg">
                  <Star className="w-5 h-5 fill-green-600 text-green-600" />
                  <span>{vendor.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {vendor.tags.map((tag, idx) => (
                  <Badge key={idx} className="bg-green-100 text-green-700">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>{vendor.distance} away</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span>{vendor.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>₹{vendor.minOrder} min order</span>
                </div>
              </div>

              <p className="text-gray-600">
                Fresh and quality products delivered to your doorstep. 
                We ensure the best quality and timely delivery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl mb-6 text-gray-900">Available Products</h2>

        <Tabs defaultValue={Object.keys(categorizedProducts)[0] || 'all'}>
          <TabsList className="mb-6">
            {Object.keys(categorizedProducts).map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(categorizedProducts).map(([category, categoryProducts]) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map((product) => {
                  const quantity = quantities[product.id] || 0;
                  const inCart = cart.some(item => item.product.id === product.id);

                  return (
                    <Card key={product.id}>
                      <CardContent className="p-0">
                        <div className="aspect-square overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-gray-900">{product.name}</h3>
                              <p className="text-sm text-gray-500">per {product.unit}</p>
                            </div>
                            {inCart && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                In Cart
                              </Badge>
                            )}
                          </div>

                          <p className="text-xl text-green-600 mb-4">
                            ₹{product.price}
                          </p>

                          {product.inStock ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuantityChange(product.id, -1)}
                                  disabled={quantity === 0}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="px-4 py-2 min-w-[3rem] text-center">
                                  {quantity || 1}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuantityChange(product.id, 1)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <Button 
                                className="flex-1 bg-green-600 hover:bg-green-700 hover:shadow-lg"
                                onClick={() => handleAddToCart(product.id)}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          ) : (
                            <Button disabled className="w-full">
                              Out of Stock
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
