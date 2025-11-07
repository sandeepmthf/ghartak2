# 🔗 Frontend-Backend Integration Guide

Complete guide for connecting GharTak React frontend with Node.js backend.

## ✅ Integration Complete

The frontend is now connected to the backend API with the following services:

### 📁 New Files Created

```
src/
├── config/
│   └── api.ts                 # API configuration & endpoints
├── services/
│   ├── api.ts                 # Generic API wrapper
│   ├── authService.ts         # Authentication API
│   ├── vendorService.ts       # Vendor & products API
│   ├── orderService.ts        # Order management API
│   └── aiService.ts           # AI features API
.env                           # Environment variables
.env.example                   # Template
```

---

## 🚀 Quick Start

### 1. Start Backend Server

```bash
cd ~/ghartak-backend
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2. Start Frontend

```bash
cd ~/Desktop/ghartak2
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 3. Test Connection

Open `http://localhost:5173` in your browser. The app will automatically connect to the backend.

---

## 📝 How to Use the Services

### Authentication Service

```typescript
import { authService } from './services/authService';

// Signup
try {
  const response = await authService.signup({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  });
  
  // Save token and user
  authService.saveAuth(response.data.token, response.data.user);
  
  console.log('Signup successful:', response.data.user);
} catch (error) {
  console.error('Signup failed:', error);
}

// Login
try {
  const response = await authService.login({
    email: 'john@example.com',
    password: 'password123'
  });
  
  authService.saveAuth(response.data.token, response.data.user);
  console.log('Login successful:', response.data.user);
} catch (error) {
  console.error('Login failed:', error);
}

// Get Profile (requires authentication)
try {
  const response = await authService.getProfile();
  console.log('User profile:', response.data);
} catch (error) {
  console.error('Failed to get profile:', error);
}

// Logout
authService.clearAuth();
```

### Vendor Service

```typescript
import { vendorService } from './services/vendorService';

// Get all vendors
try {
  const response = await vendorService.getAllVendors();
  console.log('Vendors:', response.data);
} catch (error) {
  console.error('Failed to fetch vendors:', error);
}

// Get vendor by ID
try {
  const response = await vendorService.getVendorById('1');
  console.log('Vendor:', response.data);
} catch (error) {
  console.error('Failed to fetch vendor:', error);
}

// Get vendor products
try {
  const response = await vendorService.getVendorProducts('1');
  console.log('Products:', response.data);
} catch (error) {
  console.error('Failed to fetch products:', error);
}
```

### Order Service

```typescript
import { orderService } from './services/orderService';

// Create order
try {
  const response = await orderService.createOrder({
    vendorId: '1',
    items: cart, // CartItem[]
    total: 150,
    deliveryAddress: '123 Main St',
    customerName: 'John Doe',
    customerPhone: '9876543210',
    customerEmail: 'john@example.com'
  });
  
  console.log('Order created:', response.data);
} catch (error) {
  console.error('Failed to create order:', error);
}

// Get all orders
try {
  const response = await orderService.getAllOrders({
    customerPhone: '9876543210'
  });
  
  console.log('Orders:', response.data);
} catch (error) {
  console.error('Failed to fetch orders:', error);
}

// Get order by ID
try {
  const response = await orderService.getOrderById('ORD-123');
  console.log('Order:', response.data);
} catch (error) {
  console.error('Failed to fetch order:', error);
}
```

### AI Service

```typescript
import { aiService } from './services/aiService';

// Get recommendations
try {
  const response = await aiService.getRecommendations({
    location: 'Delhi'
  });
  
  console.log('Recommendations:', response.data.recommendations);
} catch (error) {
  console.error('Failed to get recommendations:', error);
}

// Get vendor insights
try {
  const response = await aiService.getVendorInsights('1');
  console.log('Insights:', response.data);
} catch (error) {
  console.error('Failed to get insights:', error);
}

// Chat with AI
try {
  const response = await aiService.chat('Show me fresh vegetables');
  console.log('AI Response:', response.data.response);
} catch (error) {
  console.error('Chat failed:', error);
}
```

---

## 🔧 Configuration

### Environment Variables

Edit `.env` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# For production
# VITE_API_URL=https://your-backend-domain.com
```

### API Base URL

The API base URL is configured in `src/config/api.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

## 🔐 Authentication Flow

### 1. User Signs Up/Logs In
```typescript
const response = await authService.login({ email, password });
authService.saveAuth(response.data.token, response.data.user);
```

### 2. Token is Stored
- Token saved in localStorage as `ghartak_access_token`
- User data saved as `ghartak_user`

### 3. Automatic Token Attachment
All subsequent API calls automatically include the token:

```typescript
Authorization: Bearer <token>
```

This is handled by the `getAuthHeaders()` helper.

### 4. Protected Routes
Protected routes require authentication. If token is missing/invalid:
- Backend returns 401 error
- Frontend should redirect to login

---

## 🎯 Example: Update LoginPage Component

Here's how to integrate the auth service into your LoginPage:

```typescript
import { useState } from 'react';
import { authService } from '../services/authService';
import { toast } from 'sonner';

export default function LoginPage({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      // Save auth data
      authService.saveAuth(response.data.token, response.data.user);
      
      // Notify parent component
      onLoginSuccess(response.data.token, response.data.user);
      
      toast.success('Login successful!');
      onNavigate('home');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## 🎯 Example: Update VendorsPage Component

```typescript
import { useState, useEffect } from 'react';
import { vendorService } from '../services/vendorService';

export default function VendorsPage({ onNavigate }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await vendorService.getAllVendors();
      setVendors(response.data);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {vendors.map(vendor => (
        <div key={vendor.id} onClick={() => onNavigate(`vendor-${vendor.id}`)}>
          <h3>{vendor.name}</h3>
          <p>{vendor.category}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors in the console:

1. Make sure backend is running
2. Check backend CORS configuration in `.env`:
   ```env
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

### 401 Unauthorized
- Token is missing or invalid
- User needs to login again
- Check if `ghartak_access_token` exists in localStorage

### Connection Refused
- Backend is not running
- Check backend is on port 5000
- Verify `VITE_API_URL` in frontend `.env`

### API Not Found (404)
- Check API endpoint paths match backend routes
- Backend routes are prefixed with `/api`

---

## 📋 API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (protected)
- `PATCH /api/auth/profile` - Update profile (protected)

### Vendors
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get vendor by ID
- `GET /api/vendors/:id/products` - Get vendor products

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id` - Update order status

### AI Features
- `GET /api/ai/recommendations` - Get recommendations
- `GET /api/ai/vendor-insights/:id` - Vendor insights
- `GET /api/ai/demand-prediction/:id` - Demand prediction
- `POST /api/ai/chat` - AI chat

### Payments
- `POST /api/payment/create-razorpay-order` - Create Razorpay order
- `POST /api/payment/verify-razorpay` - Verify payment
- `POST /api/payment/confirm-cod` - Confirm COD

---

## 🚀 Next Steps

1. ✅ Services created and ready to use
2. 🔄 Update components to use services instead of mock data
3. 🎨 Add loading states and error handling
4. 🔐 Implement proper authentication flow
5. 💳 Integrate Razorpay payment
6. 🤖 Connect AI chat widget
7. 📊 Add vendor insights dashboard

---

## 📚 Additional Resources

- **Backend API Docs**: Check `ghartak-backend/API.md`
- **Auth Documentation**: Check `ghartak-backend/AUTH.md`
- **Backend README**: Check `ghartak-backend/README.md`

---

**Status**: 🟢 Integration Complete  
**Last Updated**: November 7, 2025
