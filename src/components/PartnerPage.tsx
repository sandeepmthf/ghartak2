import { useState } from 'react';
import { Store, TrendingUp, Smartphone, Users, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    ownerName: '',
    shopName: '',
    category: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ownerName || !formData.shopName || !formData.category || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitted(true);
    toast.success('Application submitted successfully!');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl mb-2 text-gray-900">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in partnering with Ghartak. Our team will review your application and contact you within 2-3 business days.
            </p>
            <Button 
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 hover:shadow-lg"
              onClick={() => setSubmitted(false)}
            >
              Submit Another Application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">
            Join Ghartak and Grow Your Local Business
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Reach more customers in your area and increase your sales with our easy-to-use platform
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Why Partner with Ghartak?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <TrendingUp className="w-10 h-10 text-green-600" />,
                title: 'Increase Your Reach',
                description: 'Get discovered by thousands of customers in your area'
              },
              {
                icon: <Smartphone className="w-10 h-10 text-green-600" />,
                title: 'Easy to Manage',
                description: 'Simple dashboard to manage orders and inventory'
              },
              {
                icon: <Store className="w-10 h-10 text-green-600" />,
                title: 'No Tech Skills Needed',
                description: 'We provide training and support to get you started'
              },
              {
                icon: <Users className="w-10 h-10 text-green-600" />,
                title: 'Grow Your Business',
                description: 'Access to marketing tools and analytics'
              },
            ].map((benefit, index) => (
              <Card key={index} className="text-center border-none shadow-lg">
                <CardContent className="pt-8 pb-8">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨</span>
                  </div>
                  <div>
                    <p>Rajesh Kumar</p>
                    <p className="text-sm text-gray-500">Fresh Veggie Corner</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "My sales doubled after joining Ghartak. The platform is very easy to use and I can now reach customers who couldn't visit my shop."
                </p>
                <div className="mt-4 text-green-600">
                  ↑ 100% increase in sales
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👩</span>
                  </div>
                  <div>
                    <p>Sunita Devi</p>
                    <p className="text-sm text-gray-500">Daily Needs Store</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Ghartak helped me expand my business without any additional investment. The support team is always there to help."
                </p>
                <div className="mt-4 text-green-600">
                  ↑ 80% more customers
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl text-center mb-8 text-gray-900">Vendor Registration</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Fill in your details to get started</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ownerName">Owner Name *</Label>
                      <Input
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shopName">Shop Name *</Label>
                      <Input
                        id="shopName"
                        value={formData.shopName}
                        onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                        placeholder="Your shop name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Business Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="grocery">Grocery</SelectItem>
                        <SelectItem value="dairy">Dairy Products</SelectItem>
                        <SelectItem value="meat">Meat & Seafood</SelectItem>
                        <SelectItem value="bakery">Bakery</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Shop Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="City name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="6-digit pincode"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Tell us about your business (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What products do you sell? What makes your shop special?"
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 hover:shadow-lg"
                  >
                    Register Now
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By registering, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl mb-4">
            Have Questions?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Our team is here to help you get started. Call us or send an email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="text-lg">
              📞 +91 98765 43210
            </div>
            <div className="text-lg">
              ✉️ partner@ghartak.com
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
