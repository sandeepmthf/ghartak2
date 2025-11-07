import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ChevronLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CartCheckoutPageProps {
  onNavigate: (page: string) => void;
}

// Declare Razorpay on window for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CartCheckoutPage({ onNavigate }: CartCheckoutPageProps) {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [onlinePaymentAvailable, setOnlinePaymentAvailable] = useState(true);
  
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    area: '',
    city: '',
    pincode: '',
  });

  const totalPrice = getTotalPrice();
  const deliveryFee = totalPrice > 200 ? 0 : 40;
  const finalTotal = totalPrice + deliveryFee;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-08603d78`;

  const createOrder = async () => {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          cart,
          address,
          paymentMethod,
          totalAmount: finalTotal,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data.order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handleRazorpayPayment = async (order: any) => {
    try {
      // Create Razorpay order
      const response = await fetch(`${API_BASE}/payment/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          amount: finalTotal,
          orderId: order.orderId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Check if it's a credentials/configuration error (503 or 500)
        if (response.status === 503 || response.status === 500) {
          console.log('Payment gateway not available:', data.error);
          setOnlinePaymentAvailable(false);
          toast.error('Online payment temporarily unavailable. Switching to Cash on Delivery.');
          // Automatically switch to COD
          setPaymentMethod('cod');
          setIsProcessing(false);
          return;
        }
        
        // Check for authentication errors
        if (data.error && (
          data.error.includes('Authentication failed') ||
          data.error.includes('authentication failed')
        )) {
          console.log('Payment authentication error:', data.error);
          setOnlinePaymentAvailable(false);
          toast.error('Payment gateway error. Switching to Cash on Delivery.');
          setPaymentMethod('cod');
          setIsProcessing(false);
          return;
        }
        
        throw new Error(data.error || 'Failed to create payment order');
      }

      const { razorpayOrder, keyId } = data;

      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
      }

      // Initialize Razorpay checkout
      const options = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Ghartak',
        description: `Order #${order.orderId}`,
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch(`${API_BASE}/payment/verify-razorpay`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order.orderId,
              }),
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              setCurrentOrder(verifyData.order);
              clearCart();
              setStep('success');
              toast.success('Payment successful!');
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: {
          color: '#16a34a',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleCODOrder = async (order: any) => {
    try {
      const response = await fetch(`${API_BASE}/payment/confirm-cod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          orderId: order.orderId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm order');
      }

      setCurrentOrder(data.order);
      clearCart();
      setStep('success');
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('COD order error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.name || !address.phone || !address.street || !address.area) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsProcessing(true);
    setShowSuccessDialog(true);

    try {
      // Create order in backend
      const order = await createOrder();
      
      if (paymentMethod === 'cod') {
        // Handle COD
        await handleCODOrder(order);
        setShowSuccessDialog(false);
      } else {
        // Handle online payment (Razorpay)
        setShowSuccessDialog(false);
        await handleRazorpayPayment(order);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
      setIsProcessing(false);
      setShowSuccessDialog(false);
    }
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-2xl mb-2 text-gray-900">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Button 
            size="lg"
            className="bg-green-600 hover:bg-green-700 hover:shadow-lg"
            onClick={() => onNavigate('vendors')}
          >
            Browse Vendors
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl mb-2 text-gray-900">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-2">
              Your order will be delivered in 30-45 minutes
            </p>
            {currentOrder && (
              <p className="text-sm text-gray-500 mb-4">
                Order ID: {currentOrder.orderId}
              </p>
            )}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-1">Order Total</p>
              <p className="text-2xl text-gray-900">₹{finalTotal}</p>
              {currentOrder && (
                <>
                  <Separator className="my-2" />
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="text-gray-900 capitalize">
                        {currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                         currentOrder.paymentMethod === 'upi' ? 'UPI' : 'Card'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-green-600 capitalize">{currentOrder.status}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 hover:shadow-lg"
                onClick={() => onNavigate('home')}
              >
                Back to Home
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="w-full border-2"
                onClick={() => onNavigate('vendors')}
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <Button 
            variant="ghost" 
            onClick={() => step === 'cart' ? onNavigate('vendors') : setStep('cart')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 'cart' ? 'Continue Shopping' : 'Back to Cart'}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl mb-6 text-gray-900">
          {step === 'cart' ? 'Shopping Cart' : 'Checkout'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'cart' ? (
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.product.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-gray-900">{item.product.name}</h3>
                              <p className="text-sm text-gray-500">₹{item.product.price} per {item.product.unit}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                removeFromCart(item.product.id);
                                toast.success('Removed from cart');
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="px-4 py-2 min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <p className="text-lg text-gray-900">
                              ₹{item.product.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Delivery Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={address.name}
                          onChange={(e) => setAddress({ ...address, name: e.target.value })}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          placeholder="10-digit mobile number"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="House no., Building name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="area">Area *</Label>
                        <Input
                          id="area"
                          value={address.area}
                          onChange={(e) => setAddress({ ...address, area: e.target.value })}
                          placeholder="Area, Colony"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="City"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        placeholder="6-digit pincode"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-3 border-2 border-green-600 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div>
                            <span className="block">Cash on Delivery (COD)</span>
                            <span className="text-xs text-green-700">✓ Recommended - Always Available</span>
                          </div>
                        </Label>
                      </div>
                      <div className={`flex items-center space-x-2 p-3 border rounded-lg ${!onlinePaymentAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
                        <RadioGroupItem value="upi" id="upi" disabled={!onlinePaymentAvailable} />
                        <Label htmlFor="upi" className={`flex-1 ${onlinePaymentAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                          <div>
                            <span className="block">UPI Payment</span>
                            <span className="text-xs text-gray-500">
                              {onlinePaymentAvailable ? 'GPay, PhonePe, Paytm' : 'Currently unavailable'}
                            </span>
                          </div>
                        </Label>
                      </div>
                      <div className={`flex items-center space-x-2 p-3 border rounded-lg ${!onlinePaymentAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
                        <RadioGroupItem value="card" id="card" disabled={!onlinePaymentAvailable} />
                        <Label htmlFor="card" className={`flex-1 ${onlinePaymentAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                          <div>
                            <span className="block">Credit/Debit Card</span>
                            <span className="text-xs text-gray-500">
                              {onlinePaymentAvailable ? 'Visa, Mastercard, RuPay' : 'Currently unavailable'}
                            </span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    {!onlinePaymentAvailable && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-800">
                          <strong>Note:</strong> Online payment methods are temporarily unavailable. 
                          Please use Cash on Delivery to complete your order.
                        </p>
                      </div>
                    )}
                    {paymentMethod !== 'cod' && onlinePaymentAvailable && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800">
                          <strong>Note:</strong> You will be redirected to a secure payment page. 
                          If payment fails, you can switch to Cash on Delivery.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-gray-500">
                      Add ₹{200 - totalPrice} more for free delivery
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>

                <Button 
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 hover:shadow-lg"
                  onClick={() => step === 'cart' ? setStep('checkout') : handlePlaceOrder()}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    step === 'cart' ? 'Proceed to Checkout' : 'Place Order'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-center">Processing Your Order</DialogTitle>
            <DialogDescription className="text-center">
              Please wait while we confirm your order...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
