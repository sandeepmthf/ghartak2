# 🚀 GharTak Quick Setup Guide

Complete setup guide to run the full GharTak application (frontend + backend).

## 📦 Prerequisites

- Node.js 16+ installed
- npm or yarn
- Two terminal windows

---

## ⚡ Quick Start (5 Minutes)

### Terminal 1: Backend Server

```bash
cd ~/ghartak-backend
npm install
npm run dev
```

✅ Backend running at: **http://localhost:5000**

### Terminal 2: Frontend App

```bash
cd ~/Desktop/ghartak2
npm install
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

### 🎉 Done!

Open http://localhost:5173 in your browser. The app is now connected to the backend!

---

## 🧪 Test the Connection

### 1. Check Backend Health

```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "ok",
  "message": "GharTak API is running"
}
```

### 2. Test Vendors API

```bash
curl http://localhost:5000/api/vendors
```

Should return list of 4 vendors.

### 3. Test Frontend

Open **http://localhost:5173** in browser:
- ✅ Homepage loads
- ✅ Vendors page fetches from API
- ✅ Login/Signup works
- ✅ AI chat connects to backend

---

## 📁 Project Structure

```
~/
├── ghartak-backend/          # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth, error handling
│   │   └── server.js         # Main server
│   ├── .env                  # Backend config
│   └── package.json
│
└── Desktop/ghartak2/         # React + TypeScript frontend
    ├── src/
    │   ├── components/       # React components
    │   ├── services/         # API services
    │   ├── config/           # API configuration
    │   ├── context/          # State management
    │   └── App.tsx
    ├── .env                  # Frontend config
    └── package.json
```

---

## 🔧 Configuration

### Backend (.env)

Located at: `~/ghartak-backend/.env`

```env
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Optional: Add for full features
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
OPENAI_API_KEY=your_key
JWT_SECRET=your_secret
```

### Frontend (.env)

Located at: `~/Desktop/ghartak2/.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## 🌐 API Endpoints

All backend APIs are available at `http://localhost:5000/api`

### Authentication
- POST `/api/auth/signup` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/profile` - Get profile

### Vendors
- GET `/api/vendors` - All vendors
- GET `/api/vendors/:id` - Vendor details
- GET `/api/vendors/:id/products` - Vendor products

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders` - Get orders

### AI
- GET `/api/ai/recommendations` - Product recommendations
- POST `/api/ai/chat` - AI chatbot

See full API docs: `~/ghartak-backend/API.md`

---

## 🎯 Common Tasks

### Create a New User

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Place an Order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": "1",
    "items": [{
      "product": {"id": "p1", "name": "Tomatoes", "price": 40},
      "quantity": 2
    }],
    "total": 80,
    "deliveryAddress": "123 Main St",
    "customerName": "Test User",
    "customerPhone": "9876543210"
  }'
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
cd ~/ghartak-backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend won't start
```bash
cd ~/Desktop/ghartak2
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### CORS errors
- Make sure backend is running on port 5000
- Check `ALLOWED_ORIGINS` in backend `.env` includes `http://localhost:5173`

### API not connecting
- Verify backend is running: `curl http://localhost:5000/health`
- Check frontend `.env` has correct `VITE_API_URL`
- Clear browser cache and reload

---

## 📚 Documentation

### Backend
- `~/ghartak-backend/README.md` - Main docs
- `~/ghartak-backend/API.md` - API reference
- `~/ghartak-backend/AUTH.md` - Authentication guide
- `~/ghartak-backend/QUICKSTART.md` - Quick setup

### Frontend
- `~/Desktop/ghartak2/README.md` - Main docs
- `~/Desktop/ghartak2/API_INTEGRATION.md` - Integration guide
- `~/Desktop/ghartak2/SETUP.md` - This file

---

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Configure real database (MongoDB/PostgreSQL)
3. Set strong `JWT_SECRET`
4. Add HTTPS
5. Deploy to Heroku/Railway/AWS

### Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder to Vercel/Netlify
3. Update `VITE_API_URL` to production backend URL

---

## 📦 Features Ready to Use

✅ User authentication (signup/login)  
✅ Vendor browsing  
✅ Product catalog  
✅ Shopping cart  
✅ Order placement  
✅ Order history  
✅ AI recommendations  
✅ AI chatbot  
✅ Payment integration (COD + Razorpay)  
✅ Mobile responsive  

---

## 🎉 You're All Set!

Both frontend and backend are connected and running!

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/health

Happy coding! 🚀

---

**Last Updated**: November 7, 2025  
**Status**: 🟢 Ready to Use
