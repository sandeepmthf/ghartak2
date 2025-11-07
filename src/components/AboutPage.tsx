import { Target, Heart, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">
            About Ghartak
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Empowering local sellers and connecting communities through fresh, quality groceries
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl mb-6 text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At Ghartak, we believe in the power of local commerce. Our mission is to bridge the gap between 
              neighborhood vendors and modern consumers, making fresh groceries accessible while supporting 
              local businesses. We're committed to preserving the personal touch of local shopping while 
              bringing the convenience of digital ordering.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl mb-8 text-center text-gray-900">Our Story</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" 
                  alt="Local market"
                  className="rounded-lg shadow-lg"
                />
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  Ghartak was born from a simple observation: while large retail chains were growing, 
                  our local vendors—the heart of our communities—were struggling to compete. These 
                  vendors have been serving us for generations, providing fresh produce and personalized 
                  service.
                </p>
                <p className="text-gray-700">
                  We started Ghartak in 2024 with a vision to digitally empower these local heroes. 
                  By providing them with a platform to reach customers online, we're helping them thrive 
                  in the digital age while maintaining the quality and trust they're known for.
                </p>
                <p className="text-gray-700">
                  Today, we're proud to serve thousands of customers and support hundreds of local 
                  vendors across multiple cities, making fresh groceries accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl mb-12 text-center text-gray-900">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Heart className="w-10 h-10 text-green-600" />,
                title: 'Community First',
                description: 'We prioritize the well-being of local communities and support neighborhood businesses.'
              },
              {
                icon: <Target className="w-10 h-10 text-green-600" />,
                title: 'Quality & Freshness',
                description: 'We ensure that every product delivered meets the highest standards of quality and freshness.'
              },
              {
                icon: <Users className="w-10 h-10 text-green-600" />,
                title: 'Trust & Transparency',
                description: 'We build trust through transparent pricing and reliable service for both customers and vendors.'
              },
            ].map((value, index) => (
              <Card key={index} className="text-center border-none shadow-lg">
                <CardContent className="pt-8 pb-8">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="mb-2 text-gray-900">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl mb-12 text-center text-gray-900">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Amit Sharma',
                role: 'Founder & CEO',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300'
              },
              {
                name: 'Priya Patel',
                role: 'Head of Operations',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300'
              },
              {
                name: 'Rahul Verma',
                role: 'Technology Lead',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
              },
              {
                name: 'Sneha Kumar',
                role: 'Customer Success',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300'
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl mb-6">Our Vision</h2>
            <p className="text-lg leading-relaxed">
              We envision a future where every neighborhood vendor has access to digital tools to grow 
              their business, and every customer can support their local community while enjoying the 
              convenience of modern shopping. We're building a sustainable ecosystem where local commerce 
              thrives, communities stay connected, and fresh, quality products are always within reach.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { number: '500+', label: 'Local Vendors' },
              { number: '10,000+', label: 'Happy Customers' },
              { number: '50,000+', label: 'Orders Delivered' },
              { number: '15+', label: 'Cities Covered' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
