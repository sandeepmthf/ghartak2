# 🤖 Ghartak AI Features Documentation

## Overview
Ghartak now includes powerful AI-driven features to enhance user experience, provide business insights, and optimize operations.

---

## 1. 💬 AI Chat Assistant

### What it does:
- Helps users find vendors and products
- Tracks orders and provides order status
- Answers questions about the platform
- Provides personalized assistance

### How to use:
1. Click the floating green chat button in the bottom-right corner
2. Type your question or request
3. Get instant AI-powered responses

### Technical Details:
- **Powered by:** OpenAI GPT-3.5 Turbo
- **API Endpoint:** `/make-server-08603d78/ai/chat`
- **Location:** `AIChatAssistant.tsx` component
- **Features:**
  - Context-aware responses based on platform data
  - Conversation history maintained during session
  - Accessible from all pages

### Setup Required:
✅ OpenAI API key has been configured via environment variable `OPENAI_API_KEY`

---

## 2. ✨ Personalized Product Recommendations

### What it does:
- Suggests products based on order history
- Shows popular items in user's location
- Displays trending products
- Uses collaborative filtering algorithm

### How to use:
- Recommendations appear automatically on the Home page
- Shows up to 6 recommended products
- Click "Add" to add recommended items to cart

### Technical Details:
- **Algorithm:** Collaborative filtering + Popularity-based
- **API Endpoint:** `/make-server-08603d78/ai/recommendations`
- **Location:** `ProductRecommendations.tsx` component
- **Factors considered:**
  - User's previous orders
  - Product popularity across platform
  - Location-based filtering
  - Seasonal trends

### Query Parameters:
- `userId` (optional): Filter by user's order history
- `location` (optional): Filter by user's location
- `limit` (default: 6): Number of recommendations

---

## 3. 📊 Vendor Insights & Analytics

### What it does:
- Shows vendor performance metrics
- Identifies top-selling products
- Provides restock suggestions
- Displays revenue analytics

### How to access:
1. Click "Insights" in the navigation menu
2. Select a vendor from the dropdown
3. View analytics dashboard with two tabs:
   - **Overview**: Sales performance and restock needs
   - **Predictions**: Demand forecasts

### Insights Provided:

#### Overview Tab:
- **Total Orders**: Lifetime order count
- **Total Revenue**: All-time earnings
- **Products Sold**: Unique product count
- **Top Selling Products**: Ranked by quantity sold
- **Top Revenue Products**: Ranked by revenue generated
- **Restock Suggestions**: Products with declining sales

#### Predictions Tab:
- **7-Day Demand Forecast**: Expected sales for next week
- **Average Daily Sales**: Historical average
- **Predicted Units**: Forecasted quantity

### Technical Details:
- **API Endpoints:** 
  - `/make-server-08603d78/ai/vendor-insights/:vendorId`
  - `/make-server-08603d78/ai/demand-prediction/:vendorId`
- **Location:** `VendorInsights.tsx` component
- **Algorithm:** Simple moving average for demand prediction
- **Data Source:** Historical order data from Supabase KV store

---

## 4. 🧠 Demand Prediction Model

### What it does:
- Predicts future product demand
- Analyzes sales trends
- Helps vendors plan inventory
- Uses 30-day historical data by default

### How it works:
1. Analyzes past order patterns
2. Calculates average daily sales per product
3. Projects sales for next 7 days
4. Identifies trending products

### Technical Details:
- **Method:** Moving average prediction
- **Time Window:** 30 days (configurable)
- **Output:** Product-level forecasts
- **Accuracy:** Improves with more historical data

---

## Backend Architecture

### AI Services (`/supabase/functions/server/ai_services.tsx`)

All AI logic is modularized in this file:

1. **generateRecommendations(userId?, location?, limit)**
   - Returns personalized product recommendations
   
2. **generateVendorInsights(vendorId)**
   - Returns comprehensive vendor analytics
   
3. **predictDemand(vendorId, days)**
   - Returns demand predictions for vendor's products
   
4. **getChatContext(userId?)**
   - Prepares context for AI chatbot

### API Routes (`/supabase/functions/server/index.tsx`)

All routes are prefixed with `/make-server-08603d78/ai/`:

- `GET /recommendations` - Get product recommendations
- `GET /vendor-insights/:vendorId` - Get vendor analytics
- `GET /demand-prediction/:vendorId` - Get demand forecasts
- `POST /chat` - AI chat assistant

---

## Environment Variables Required

| Variable | Purpose | Status |
|----------|---------|--------|
| `OPENAI_API_KEY` | Powers AI chat assistant | ✅ Configured |

---

## Future Enhancements

### Potential Additions:
1. **Smart Delivery Route Optimization**
   - Use Google Maps API or similar
   - Optimize delivery sequences
   - Reduce delivery time and costs

2. **Image Recognition for Products**
   - Upload product photos
   - Auto-categorize items
   - Visual search capability

3. **Customer Sentiment Analysis**
   - Analyze reviews and feedback
   - Identify service issues
   - Improve customer satisfaction

4. **Dynamic Pricing Suggestions**
   - Competitive pricing analysis
   - Demand-based pricing
   - Maximize vendor revenue

5. **Fraud Detection**
   - Identify suspicious orders
   - Prevent fake accounts
   - Secure platform integrity

---

## Usage Tips

### For Customers:
1. Use the AI chat for quick questions
2. Check recommendations for discovering new products
3. Save time with personalized suggestions

### For Vendors:
1. Check Insights dashboard daily
2. Review restock suggestions weekly
3. Use demand predictions for inventory planning
4. Monitor top-selling products for marketing

---

## Performance Considerations

- **Caching:** Recommendations are fetched on-demand
- **Optimization:** Consider implementing caching for frequently accessed data
- **Scaling:** AI features work efficiently with current KV store architecture
- **Rate Limits:** Be mindful of OpenAI API rate limits

---

## Troubleshooting

### AI Chat not responding:
- Verify `OPENAI_API_KEY` is set
- Check browser console for errors
- Ensure backend server is running

### No recommendations showing:
- Ensure there are orders in the system
- Check that products have proper metadata
- Verify API endpoint is accessible

### Insights showing no data:
- Create test orders for vendors
- Ensure vendorId is correct
- Check backend logs for errors

---

## API Testing

### Test Recommendations:
```bash
curl -X GET "https://[PROJECT_ID].supabase.co/functions/v1/make-server-08603d78/ai/recommendations?limit=6" \
  -H "Authorization: Bearer [ANON_KEY]"
```

### Test Chat:
```bash
curl -X POST "https://[PROJECT_ID].supabase.co/functions/v1/make-server-08603d78/ai/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -d '{"message": "Hello, how can I track my order?"}'
```

### Test Vendor Insights:
```bash
curl -X GET "https://[PROJECT_ID].supabase.co/functions/v1/make-server-08603d78/ai/vendor-insights/fresh-veggies" \
  -H "Authorization: Bearer [ANON_KEY]"
```

---

## Credits

- **AI Model:** OpenAI GPT-3.5 Turbo
- **Backend:** Supabase Edge Functions (Deno)
- **Frontend:** React + TypeScript
- **UI Components:** shadcn/ui + Tailwind CSS

---

## Support

For questions or issues with AI features:
1. Check backend logs in Supabase dashboard
2. Review browser console for frontend errors
3. Ensure all environment variables are set
4. Verify API endpoints are accessible

**Last Updated:** November 3, 2025
