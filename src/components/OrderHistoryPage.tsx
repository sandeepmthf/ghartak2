import { useState, useEffect } from 'react';
import { ChevronLeft, Package, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface OrderHistoryPageProps {
  onNavigate: (page: string) => void;
}

export default function OrderHistoryPage({ onNavigate }: OrderHistoryPageProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-08603d78`;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/orders`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'awaiting_payment':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-gray-900">Order History</h1>
          <Button 
            variant="outline" 
            onClick={fetchOrders}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Refresh'
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl mb-2 text-gray-900">No orders yet</h2>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onNavigate('vendors')}
              >
                Browse Vendors
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.orderId}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    {order.cart.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{item.product.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} × ₹{item.product.price}
                          </p>
                        </div>
                        <p className="text-sm text-gray-900">
                          ₹{item.product.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-gray-600 mb-2">Delivery Address</h4>
                      <p className="text-sm text-gray-900">
                        {order.address.name}<br />
                        {order.address.street}, {order.address.area}<br />
                        {order.address.city && `${order.address.city}, `}
                        {order.address.pincode}<br />
                        Phone: {order.address.phone}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-600 mb-2">Payment Details</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Method:</span>
                          <span className="text-gray-900 capitalize">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' :
                             order.paymentMethod === 'upi' ? 'UPI' : 'Card'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="text-gray-900">₹{order.totalAmount}</span>
                        </div>
                        {order.paymentDetails?.razorpay_payment_id && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment ID:</span>
                            <span className="text-xs text-gray-700">
                              {order.paymentDetails.razorpay_payment_id}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
