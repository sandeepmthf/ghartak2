# Ghartak Payment System Setup Guide

## Overview
Ghartak now has a fully functional payment system integrated with **Razorpay**, supporting multiple payment methods including Cash on Delivery (COD), UPI, Credit/Debit Cards, and Net Banking.

## Features Implemented

### 1. **Multiple Payment Methods**
- ✅ Cash on Delivery (COD)
- ✅ UPI (Google Pay, PhonePe, Paytm)
- ✅ Credit/Debit Cards
- ✅ Net Banking

### 2. **Backend API Endpoints**
All endpoints are prefixed with `/make-server-08603d78`:

- `POST /orders` - Create a new order
- `GET /orders` - Get all orders
- `GET /orders/:orderId` - Get specific order details
- `PATCH /orders/:orderId` - Update order status
- `POST /payment/create-razorpay-order` - Create Razorpay payment order
- `POST /payment/verify-razorpay` - Verify Razorpay payment signature
- `POST /payment/confirm-cod` - Confirm COD order
- `GET /payment/stats` - Get payment statistics

### 3. **Order Management**
- Real-time order creation and tracking
- Order history page for customers
- Payment status tracking (pending, paid, awaiting_payment)
- Order status tracking (pending, confirmed, cancelled)

### 4. **Security Features**
- Payment signature verification
- Secure API communication
- HTTPS-only payment processing
- Environment-based API key management

## Setup Instructions

### Step 1: Get Razorpay API Keys

1. **Sign up for Razorpay**: Visit [https://razorpay.com](https://razorpay.com) and create an account
2. **Test Mode**: Start with test mode for development
3. **Get API Keys**:
   - Go to Settings → API Keys
   - Generate Test Keys (or Live Keys for production)
   - You'll get:
     - `Key ID` (starts with `rzp_test_` or `rzp_live_`)
     - `Key Secret` (keep this confidential)

### Step 2: Configure Environment Variables

You've already been prompted to add these secrets in Figma Make:
- `RAZORPAY_KEY_ID` - Your Razorpay Key ID
- `RAZORPAY_KEY_SECRET` - Your Razorpay Key Secret

**IMPORTANT:** Until you configure these credentials with your actual Razorpay API keys:
- Online payment options (UPI, Card) will not work
- The app will show error messages suggesting to use COD
- Cash on Delivery (COD) will work perfectly without any configuration

**To add your Razorpay credentials:**
1. Get your API keys from Razorpay dashboard
2. In Figma Make, look for the environment variable prompts
3. Enter your `RAZORPAY_KEY_ID` (starts with `rzp_test_` or `rzp_live_`)
4. Enter your `RAZORPAY_KEY_SECRET`
5. Save and the online payment methods will start working

**Note:** You can test the entire app using Cash on Delivery without configuring Razorpay.

### Step 3: Test the Payment Flow

#### For COD Orders:
1. Add products to cart
2. Go to checkout
3. Fill in delivery address
4. Select "Cash on Delivery"
5. Click "Place Order"
6. Order will be created with "confirmed" status

#### For Online Payments (UPI/Card):
1. Add products to cart
2. Go to checkout
3. Fill in delivery address
4. Select "UPI Payment" or "Credit/Debit Card"
5. Click "Place Order"
6. Razorpay checkout modal will open
7. Complete payment using test cards/UPI
8. Payment will be verified and order confirmed

### Step 4: Test Payment Cards (Test Mode Only)

Use these test card details when in test mode:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`
- This will simulate a payment failure

**Test UPI:**
- UPI ID: `success@razorpay`
- This will simulate successful UPI payment

## Important Production Checklist

When going to production:

1. **Switch to Live Keys**:
   - Replace test keys with live keys in environment variables
   - Enable live mode in Razorpay dashboard

2. **Webhook Setup** (Recommended):
   - Configure webhooks in Razorpay dashboard
   - Add webhook endpoint to handle payment events
   - Verify webhook signatures

3. **Security**:
   - Never expose `RAZORPAY_KEY_SECRET` to frontend
   - Always verify payment signatures on backend
   - Use HTTPS only
   - Implement rate limiting on payment endpoints

4. **Compliance**:
   - Review Razorpay's terms of service
   - Ensure PCI DSS compliance
   - Add privacy policy and terms & conditions
   - Display refund/cancellation policy

5. **Testing**:
   - Test all payment methods thoroughly
   - Test payment failures and edge cases
   - Test order status updates
   - Verify email/SMS notifications (if implemented)

## Payment Flow Architecture

```
Customer -> Add to Cart -> Checkout
                           ↓
                    Fill Address
                           ↓
              Select Payment Method
                           ↓
         ┌─────────────────┴─────────────────┐
         ↓                                   ↓
    Cash on Delivery                  Online Payment
         ↓                                   ↓
  Create Order                      Create Order
         ↓                                   ↓
  Confirm COD Order              Create Razorpay Order
         ↓                                   ↓
    Order Placed                   Open Razorpay Checkout
                                            ↓
                                    Customer Pays
                                            ↓
                                   Verify Signature
                                            ↓
                                   Update Order Status
                                            ↓
                                    Order Confirmed
```

## Order Status Lifecycle

1. **pending** - Order created, awaiting confirmation
2. **confirmed** - Order confirmed, ready for processing
3. **processing** - Order being prepared
4. **dispatched** - Order sent for delivery
5. **delivered** - Order delivered to customer
6. **cancelled** - Order cancelled

## Payment Status Lifecycle

1. **awaiting_payment** - Waiting for customer to pay
2. **pending** - Payment initiated but not confirmed
3. **paid** - Payment successful and verified
4. **failed** - Payment failed
5. **refunded** - Payment refunded to customer

## Troubleshooting

### Issue: Razorpay checkout not opening
- Check if `RAZORPAY_KEY_ID` is set correctly
- Verify Razorpay script is loaded (check browser console)
- Ensure you're using test mode keys in development

### Issue: Payment verification failing
- Check if `RAZORPAY_KEY_SECRET` is correct
- Verify signature calculation matches Razorpay's format
- Check server logs for detailed error messages

### Issue: Orders not saving
- Verify Supabase connection is active
- Check browser console and server logs for errors
- Ensure KV store is accessible

## Support Resources

- **Razorpay Documentation**: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Razorpay Test Mode**: [https://razorpay.com/docs/payments/payments/test-card-details/](https://razorpay.com/docs/payments/payments/test-card-details/)
- **Integration Guide**: [https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)

## Next Steps

Consider implementing these additional features:

1. **Email Notifications** - Send order confirmations via email
2. **SMS Updates** - Send delivery updates via SMS
3. **Vendor Dashboard** - Allow vendors to manage orders
4. **Order Tracking** - Real-time order tracking for customers
5. **Refund System** - Handle refunds and cancellations
6. **Coupon Codes** - Implement discount coupons
7. **Wallet Integration** - Add wallet payment options
8. **Auto-refund** - Automatic refunds for cancelled orders
