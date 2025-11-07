# 🏪 GharTak - Hyperlocal Grocery Delivery Platform

**From your local market... to your doorstep.**

GharTak is a modern, AI-powered hyperlocal delivery platform that connects customers with local grocery vendors, vegetable sellers, and daily essential providers in their neighborhood.

---

## 🌟 Key Features

### 🛒 **Core Marketplace**
- **7 Main Pages**: Home, Vendors, Vendor Detail, Cart/Checkout, Partner, About, Contact
- **Mobile-First Design**: Fully responsive across all devices
- **Cart Management**: Real-time cart with Context API
- **Category Filtering**: Browse by product categories
- **Ratings & Reviews**: Vendor and product ratings
- **Order History**: Track all past and current orders

### 💳 **Payment System**
- **Multiple Payment Options**:
  - 💵 Cash on Delivery (COD)
  - 📱 UPI (GPay, PhonePe, Paytm)
  - 💳 Credit/Debit Cards
  - 🏦 Net Banking
- **Razorpay Integration**: Secure online payment processing
- **Order Management**: Real-time order tracking and status updates
- **Payment Analytics**: Revenue and payment statistics dashboard

### 🤖 **AI-Powered Features**

#### 1. **AI Chat Assistant** 💬
- Instant help via OpenAI GPT-3.5 Turbo
- Find products and vendors
- Track orders
- Answer platform questions
- Floating chat widget on all pages

#### 2. **Smart Recommendations** ✨
- Personalized product suggestions
- Collaborative filtering algorithm
- Location-based recommendations
- Popular products in your area
- Seasonal trends analysis

#### 3. **Vendor Insights Dashboard** 📊
- Sales analytics and performance metrics
- Top-selling products
- Revenue tracking
- Restock suggestions for low-activity items
- Product-level statistics

#### 4. **Demand Forecasting** 📈
- AI-powered 7-day sales predictions
- Historical trend analysis
- Inventory planning assistance
- Moving average algorithm
- Product-specific forecasts

### 📍 **Nearby Shops (New!)**
- **Real-Time Location Detection**: Browser geolocation API
- **Live Shop Data**: Powered by OpenStreetMap + Overpass API
- **5km Radius Search**: Finds actual local shops around you
- **Interactive Map**: Embedded OpenStreetMap view
- **Shop Details**: Name, address, phone, hours, distance
- **Get Directions**: Direct Google Maps integration
- **No Setup Required**: Uses public APIs, no configuration needed

---

## 🎨 Design System

### **Brand Colors**
- **Primary Green**: `#00A86B` (green-600)
- **Accent Orange**: `#FF8C42` (orange-600)
- **Background**: `#F9F9F9` (gray-50)

### **Technology Stack**
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Backend**: Supabase Edge Functions (Deno + Hono)
- **Database**: Supabase KV Store
- **Payments**: Razorpay
- **AI**: OpenAI GPT-3.5 Turbo
- **Maps**: OpenStreetMap + Overpass API

---

## 📂 Project Structure

```
ghartak/
├── components/
│   ├── AIChatAssistant.tsx         # AI chatbot widget
│   ├── AIFeaturesShowcase.tsx      # AI features highlight
│   ├── ProductRecommendations.tsx  # Smart product suggestions
│   ├── VendorInsights.tsx          # Analytics dashboard
│   ├── NearbyShopsPage.tsx         # Location-based shop finder
│   ├── HomePage.tsx                # Landing page
│   ├── VendorsPage.tsx             # Vendor listing
│   ├── VendorDetailPage.tsx        # Individual vendor page
│   ├── CartCheckoutPage.tsx        # Cart and checkout
│   ├── OrderHistoryPage.tsx        # Order tracking
│   ├── VendorDashboardPage.tsx     # Vendor insights page
│   ├── PartnerPage.tsx             # Become a partner
│   ├── AboutPage.tsx               # About us
│   ├── ContactPage.tsx             # Contact form
│   └── ui/                         # shadcn/ui components
├── supabase/functions/server/
│   ├── index.tsx                   # Main server routes
│   ├── ai_services.tsx             # AI algorithms & logic
│   └── kv_store.tsx                # Database utilities
├── context/
│   └── CartContext.tsx             # Global cart state
├── data/
│   └── mockData.ts                 # Sample vendor data
└── utils/
    └── supabase/
        └── info.tsx                # Supabase config
```

---

## 🚀 Pages & Routes

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `home` | Landing page with hero, features, vendors |
| **Nearby Shops** | `nearby-shops` | Real-time shop discovery via location |
| **Vendors** | `vendors` | Browse all available vendors |
| **Vendor Detail** | `vendor-{id}` | Individual vendor page with products |
| **Cart** | `cart` | Shopping cart and checkout |
| **Orders** | `orders` | Order history and tracking |
| **Insights** | `vendor-dashboard` | AI-powered vendor analytics |
| **Partner** | `partner` | Vendor registration form |
| **About** | `about` | Company information |
| **Contact** | `contact` | Contact form |

---

## 🔌 API Endpoints

### **Order Management**
- `POST /make-server-08603d78/orders` - Create order
- `GET /make-server-08603d78/orders/:orderId` - Get order details
- `GET /make-server-08603d78/orders` - List all orders
- `PATCH /make-server-08603d78/orders/:orderId` - Update order status

### **Payment Processing**
- `POST /make-server-08603d78/payment/create-razorpay-order` - Create Razorpay order
- `POST /make-server-08603d78/payment/verify-razorpay` - Verify payment signature
- `POST /make-server-08603d78/payment/confirm-cod` - Confirm COD order
- `GET /make-server-08603d78/payment/stats` - Payment statistics

### **AI Features**
- `GET /make-server-08603d78/ai/recommendations` - Get product recommendations
- `GET /make-server-08603d78/ai/vendor-insights/:vendorId` - Vendor analytics
- `GET /make-server-08603d78/ai/demand-prediction/:vendorId` - Demand forecasts
- `POST /make-server-08603d78/ai/chat` - AI chat assistant

---

## 🔐 Environment Variables

Required environment variables (already configured):

```bash
SUPABASE_URL              # Supabase project URL
SUPABASE_ANON_KEY         # Public anonymous key
SUPABASE_SERVICE_ROLE_KEY # Service role key (server-only)
RAZORPAY_KEY_ID           # Razorpay public key
RAZORPAY_KEY_SECRET       # Razorpay secret key
OPENAI_API_KEY            # OpenAI API key for chatbot
```

---

## 📱 Mobile Responsiveness

- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Mobile Navigation**: Hamburger menu for small screens
- **Touch-Optimized**: Large buttons, easy tapping
- **Adaptive Layouts**: Single-column on mobile, multi-column on desktop
- **Optimized Maps**: Map positioning adjusts for mobile viewing

---

## 🎯 User Flows

### **Customer Journey**
1. Land on homepage
2. Use AI chat or browse vendors
3. View nearby shops via location
4. Select vendor → Browse products
5. Add items to cart
6. Checkout with preferred payment method
7. Track order in order history

### **Vendor Journey**
1. Click "Partner with Us"
2. Fill registration form
3. Access vendor insights dashboard
4. View sales analytics
5. Check demand predictions
6. Plan inventory restocking

---

## 🧠 AI Capabilities

### **Recommendation Algorithm**
- **Collaborative Filtering**: Based on user order history
- **Popularity Scoring**: Product frequency across all orders
- **Location-Based**: Filters by user's city/area
- **Seasonal Trends**: Adapts to time-based patterns

### **Vendor Insights**
- **Top Sellers**: Ranked by quantity sold
- **Revenue Leaders**: Products generating most income
- **Restock Alerts**: Items not ordered in 30+ days
- **Performance Metrics**: Total orders, revenue, product count

### **Demand Prediction**
- **Method**: Simple moving average
- **Data Window**: 30 days historical
- **Forecast Period**: 7 days ahead
- **Granularity**: Product-level predictions

### **Chat Assistant**
- **Model**: OpenAI GPT-3.5 Turbo
- **Context-Aware**: Uses platform data for relevant responses
- **Conversation Memory**: Maintains chat history
- **Natural Language**: Understands various query formats

---

## 🗺️ Location Features

### **Geolocation API**
- High-accuracy GPS positioning
- Permission handling
- Error state management
- 10-second timeout

### **Overpass API**
- Real-time OpenStreetMap data
- 5km search radius
- Shop categorization
- Distance calculations (Haversine formula)

### **Map Integration**
- Embedded OpenStreetMap
- User location marker
- Interactive pan/zoom
- Responsive iframe

---

## 💡 Usage Tips

### **For Customers:**
1. Enable location for best experience
2. Use AI chat for quick assistance
3. Check recommendations for new products
4. Save favorite vendors
5. Track orders in real-time

### **For Vendors:**
1. Review insights dashboard daily
2. Monitor top-selling products
3. Follow restock suggestions
4. Use demand predictions for inventory
5. Respond to customer inquiries

---

## 📊 Features Comparison

| Feature | Basic | GharTak | Premium |
|---------|-------|---------|---------|
| Vendor Listings | ✅ | ✅ | ✅ |
| Online Payments | ❌ | ✅ | ✅ |
| AI Chat | ❌ | ✅ | ✅ |
| Recommendations | ❌ | ✅ | ✅ |
| Location-Based Search | ❌ | ✅ | ✅ |
| Vendor Analytics | ❌ | ✅ | ✅ |
| Demand Forecasting | ❌ | ✅ | ✅ |
| Real-Time Shop Data | ❌ | ✅ | ✅ |

---

## 🔄 Future Roadmap

### **Phase 1** (Current)
- ✅ Core marketplace functionality
- ✅ Payment integration
- ✅ AI features
- ✅ Location-based shop discovery

### **Phase 2** (Planned)
- [ ] User authentication system
- [ ] Vendor self-service portal
- [ ] Advanced map with custom markers
- [ ] Real-time order tracking
- [ ] Push notifications

### **Phase 3** (Future)
- [ ] Delivery route optimization
- [ ] Image recognition for products
- [ ] Customer sentiment analysis
- [ ] Dynamic pricing engine
- [ ] Fraud detection system
- [ ] Mobile app (iOS/Android)

---

## 🐛 Troubleshooting

### **Payment Issues**
- Ensure Razorpay keys are configured
- Check bank account verification
- Verify internet connection

### **AI Chat Not Working**
- Confirm OpenAI API key is set
- Check browser console for errors
- Verify server is running

### **Location Access Denied**
- Enable location in browser settings
- Ensure HTTPS connection
- Try different browser

### **No Shops Found**
- Verify your location is accurate
- Try different area (urban vs rural)
- Check Overpass API status

---

## 📞 Support & Documentation

- **AI Features**: See [AI_FEATURES.md](/AI_FEATURES.md)
- **Nearby Shops**: See [NEARBY_SHOPS_FEATURE.md](/NEARBY_SHOPS_FEATURE.md)
- **Payment Setup**: See [PAYMENT_SETUP.md](/PAYMENT_SETUP.md)
- **Setup Status**: See [SETUP_STATUS.md](/SETUP_STATUS.md)

---

## 🙏 Credits & Attribution

- **Maps**: OpenStreetMap contributors
- **API**: Overpass API
- **Payments**: Razorpay
- **AI**: OpenAI
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Backend**: Supabase

---

## 📄 License

This project is part of the GharTak platform. All rights reserved.

---

## 🎉 Get Started

1. **Browse** vendors on the home page
2. **Click** "Nearby Shops" to find real stores around you
3. **Chat** with our AI assistant for help
4. **Shop** from your favorite local vendors
5. **Pay** securely with multiple payment options
6. **Track** your orders in real-time

**Welcome to GharTak - Your neighborhood, delivered! 🚀**

---

**Last Updated:** November 6, 2025  
**Version:** 2.0.0  
**Status:** 🟢 Production Ready
