import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitted(true);
    toast.success('Message sent successfully!');
    
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-gray-900">Phone</h3>
                      <p className="text-gray-600">Customer Support</p>
                      <a href="tel:+919876543210" className="text-green-600 hover:underline">
                        +91 98765 43210
                      </a>
                      <p className="text-gray-600 mt-2">Vendor Support</p>
                      <a href="tel:+919876543211" className="text-green-600 hover:underline">
                        +91 98765 43211
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-gray-900">Email</h3>
                      <p className="text-gray-600">General Inquiries</p>
                      <a href="mailto:hello@ghartak.com" className="text-green-600 hover:underline">
                        hello@ghartak.com
                      </a>
                      <p className="text-gray-600 mt-2">Partner Support</p>
                      <a href="mailto:partner@ghartak.com" className="text-green-600 hover:underline">
                        partner@ghartak.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-gray-900">Office</h3>
                      <p className="text-gray-600">
                        123 Market Street<br />
                        Connaught Place<br />
                        New Delhi - 110001<br />
                        India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <h3 className="mb-2 text-gray-900">Business Hours</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-xl mb-2 text-gray-900">Thank You!</h3>
                      <p className="text-gray-600">
                        Your message has been sent successfully. We'll get back to you soon.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Your phone number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="What is this about?"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us what you need help with..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button 
                        type="submit"
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700 hover:shadow-lg"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl mb-12 text-center text-gray-900">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                question: 'What are your delivery hours?',
                answer: 'We deliver from 8 AM to 9 PM, 7 days a week. Same-day delivery is available for orders placed before 6 PM.'
              },
              {
                question: 'How can I become a vendor?',
                answer: 'Visit our Partner with Us page and fill out the vendor registration form. Our team will contact you within 2-3 business days.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept Cash on Delivery (COD), UPI, Credit/Debit Cards, and net banking.'
              },
              {
                question: 'Is there a minimum order value?',
                answer: 'Minimum order value varies by vendor, typically ranging from ₹30 to ₹100. Free delivery on orders above ₹200.'
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="mb-2 text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-0">
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Map View</p>
            <p className="text-sm text-gray-500">123 Market Street, Connaught Place, New Delhi</p>
          </div>
        </div>
      </section>
    </div>
  );
}
