import { Search, ShoppingBag, Truck, DollarSign, Users, MapPin, Eye, CheckCircle, Star, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { mockVendors } from '../data/mockData';
import { ProductRecommendations } from './ProductRecommendations';
import { AIFeaturesShowcase } from './AIFeaturesShowcase';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900">
              Fresh groceries from your local market, delivered to your door.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Find nearby vegetable vendors, grocery stores, and daily essentials from your neighbourhood.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="Enter your area to start shopping" 
                  className="pl-10 h-14 text-base"
                />
              </div>
              <Button 
                className="bg-green-600 hover:bg-green-700 h-14 px-10 text-base"
                onClick={() => onNavigate('vendors')}
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600"
                onClick={() => onNavigate('nearby-shops')}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Find Shops Near Me
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700"
              >
                📲 Get the App
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <AIFeaturesShowcase />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-gray-900">
            Why Choose Ghartak?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShoppingBag className="w-10 h-10 text-green-600" />,
                title: 'Order from trusted local sellers',
                description: 'Support your neighborhood vendors and get fresh products'
              },
              {
                icon: <Truck className="w-10 h-10 text-green-600" />,
                title: 'Fast same-day delivery',
                description: 'Get your groceries delivered within hours'
              },
              {
                icon: <DollarSign className="w-10 h-10 text-green-600" />,
                title: 'Affordable & transparent prices',
                description: 'No hidden charges, fair pricing for everyone'
              },
              {
                icon: <Users className="w-10 h-10 text-green-600" />,
                title: 'Support your neighbourhood vendors',
                description: 'Help local businesses grow and thrive'
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-gray-900">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                icon: <MapPin className="w-8 h-8" />,
                title: 'Enter your location',
                description: 'Tell us where you want delivery'
              },
              {
                step: '2',
                icon: <Eye className="w-8 h-8" />,
                title: 'Browse nearby vendors',
                description: 'See shops in your neighborhood'
              },
              {
                step: '3',
                icon: <ShoppingBag className="w-8 h-8" />,
                title: 'Add items to cart',
                description: 'Choose fresh products you need'
              },
              {
                step: '4',
                icon: <CheckCircle className="w-8 h-8" />,
                title: 'Checkout & get delivery',
                description: 'Pay and receive your order'
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-sm text-green-600 mb-2">Step {item.step}</div>
                <h3 className="mb-2 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Shops Feature Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-2xl">📍</span>
              <span className="text-sm font-medium">New Feature</span>
            </div>
            <h2 className="text-3xl md:text-5xl mb-6">
              Discover Real Shops Around You
            </h2>
            <p className="text-lg md:text-xl mb-8 text-orange-100">
              Use live location data to find actual grocery stores, vegetable vendors, and local markets within 5 km of your location - powered by OpenStreetMap
            </p>
            <Button
              size="lg"
              onClick={() => onNavigate('nearby-shops')}
              className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <Navigation className="h-6 w-6 mr-2" />
              Explore Nearby Shops
            </Button>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProductRecommendations limit={6} />
        </div>
      </section>

      {/* Vendor Highlight */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl text-gray-900">Top Sellers Near You</h2>
            <Button 
              variant="outline"
              onClick={() => onNavigate('vendors')}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockVendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate(`vendor-${vendor.id}`)}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={vendor.image} 
                    alt={vendor.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-900">{vendor.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{vendor.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{vendor.distance} • {vendor.deliveryTime}</p>
                  <div className="flex flex-wrap gap-2">
                    {vendor.tags.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-gray-900">
            What People Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Love that I can support my local shop again! The vegetables are always fresh and delivery is super fast."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span>👩</span>
                  </div>
                  <div>
                    <p className="text-sm">Priya Sharma</p>
                    <p className="text-xs text-gray-500">Customer from Delhi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "My sales doubled after joining Ghartak. It's easy to use and I can reach more customers in my area."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span>👨</span>
                  </div>
                  <div>
                    <p className="text-sm">Rajesh Kumar</p>
                    <p className="text-xs text-gray-500">Vendor from Mumbai</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-4 text-gray-900">
            Multiple Payment Options
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Pay the way you prefer - we support all major payment methods for your convenience
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-green-600 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">💵</div>
                <h3 className="mb-1 text-gray-900">Cash on Delivery</h3>
                <p className="text-xs text-gray-600">Pay when you receive</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-green-600 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="mb-1 text-gray-900">UPI</h3>
                <p className="text-xs text-gray-600">GPay, PhonePe, Paytm</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-green-600 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">💳</div>
                <h3 className="mb-1 text-gray-900">Cards</h3>
                <p className="text-xs text-gray-600">Credit & Debit cards</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-green-600 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">🏦</div>
                <h3 className="mb-1 text-gray-900">Net Banking</h3>
                <p className="text-xs text-gray-600">All major banks</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">100% Secure & Encrypted Payments powered by Razorpay</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">
            Ready to support your local vendors?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers shopping from their neighbourhood stores
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 hover:text-green-700"
              onClick={() => onNavigate('vendors')}
            >
              Start Shopping
            </Button>
            <Button 
              size="lg" 
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:text-gray-900 border-2 border-yellow-400 hover:border-yellow-300 shadow-xl hover:shadow-2xl"
              onClick={() => onNavigate('partner')}
            >
              Become a Partner
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
