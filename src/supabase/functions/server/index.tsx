import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import * as ai from "./ai_services.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-08603d78/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTHENTICATION ====================

// Sign Up
app.post("/make-server-08603d78/auth/signup", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    // Create user with admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.error("Sign up error:", error);
      return c.json({ error: error.message }, 400);
    }

    console.log(`User created successfully: ${email}`);
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error("Error during sign up:", error);
    return c.json({ error: `Sign up failed: ${error.message}` }, 500);
  }
});

// Sign In
app.post("/make-server-08603d78/auth/signin", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Sign in with password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return c.json({ error: error.message }, 401);
    }

    if (!data.session) {
      return c.json({ error: "Failed to create session" }, 500);
    }

    console.log(`User signed in successfully: ${email}`);
    return c.json({ 
      success: true, 
      access_token: data.session.access_token,
      user: data.user,
    });
  } catch (error) {
    console.error("Error during sign in:", error);
    return c.json({ error: `Sign in failed: ${error.message}` }, 500);
  }
});

// Get current user from token
app.get("/make-server-08603d78/auth/user", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: `Failed to fetch user: ${error.message}` }, 500);
  }
});

// ==================== ORDER MANAGEMENT ====================

// Create a new order
app.post("/make-server-08603d78/orders", async (c) => {
  try {
    const body = await c.req.json();
    const { cart, address, paymentMethod, totalAmount } = body;

    if (!cart || !address || !paymentMethod || !totalAmount) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    const order = {
      orderId,
      cart,
      address,
      paymentMethod,
      totalAmount,
      status: "pending",
      paymentStatus: paymentMethod === "cod" ? "pending" : "awaiting_payment",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, order);
    
    console.log(`Order created successfully: ${orderId}`);
    return c.json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ error: `Failed to create order: ${error.message}` }, 500);
  }
});

// Get order by ID
app.get("/make-server-08603d78/orders/:orderId", async (c) => {
  try {
    const { orderId } = c.req.param();
    const order = await kv.get(`order:${orderId}`);
    
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    return c.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return c.json({ error: `Failed to fetch order: ${error.message}` }, 500);
  }
});

// Get all orders (for admin or user)
app.get("/make-server-08603d78/orders", async (c) => {
  try {
    const orders = await kv.getByPrefix("order:");
    
    // Sort by date (newest first)
    const sortedOrders = orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ success: true, orders: sortedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return c.json({ error: `Failed to fetch orders: ${error.message}` }, 500);
  }
});

// Update order status
app.patch("/make-server-08603d78/orders/:orderId", async (c) => {
  try {
    const { orderId } = c.req.param();
    const body = await c.req.json();
    const { status, paymentStatus } = body;

    const order = await kv.get(`order:${orderId}`);
    
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    const updatedOrder = {
      ...order,
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, updatedOrder);
    
    console.log(`Order ${orderId} updated successfully`);
    return c.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    return c.json({ error: `Failed to update order: ${error.message}` }, 500);
  }
});

// ==================== RAZORPAY PAYMENT INTEGRATION ====================

// Create Razorpay order
app.post("/make-server-08603d78/payment/create-razorpay-order", async (c) => {
  try {
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    // Check if credentials are provided and not empty
    if (!razorpayKeyId || !razorpayKeySecret || 
        razorpayKeyId.trim() === '' || razorpayKeySecret.trim() === '') {
      console.error("Razorpay credentials not configured or empty");
      return c.json({ 
        error: "Online payment is not available. Razorpay credentials not configured.",
        suggestion: "Please use Cash on Delivery option." 
      }, 503);
    }

    // Validate credentials format only if they're provided
    if (!razorpayKeyId.startsWith('rzp_test_') && !razorpayKeyId.startsWith('rzp_live_')) {
      console.error(`Invalid Razorpay Key ID format: ${razorpayKeyId.substring(0, 8)}...`);
      return c.json({ 
        error: "Online payment is not available. Invalid Razorpay configuration.",
        suggestion: "Please use Cash on Delivery option." 
      }, 503);
    }

    const body = await c.req.json();
    const { amount, orderId, currency = "INR" } = body;

    if (!amount || !orderId) {
      return c.json({ error: "Amount and orderId are required" }, 400);
    }

    // Create Razorpay order
    const razorpayOrder = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: orderId,
    };

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(razorpayOrder),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Razorpay API error:", errorData);
      
      // Check for authentication errors
      if (response.status === 401 || errorData.includes("Authentication failed")) {
        return c.json({ 
          error: "Razorpay authentication failed. Please verify your API credentials are correct.",
          suggestion: "Use Cash on Delivery option instead or contact support."
        }, 401);
      }
      
      return c.json({ 
        error: `Razorpay API error: ${errorData}`,
        suggestion: "Please try again or use Cash on Delivery option."
      }, response.status);
    }

    const razorpayOrderData = await response.json();
    
    console.log(`Razorpay order created: ${razorpayOrderData.id}`);
    return c.json({ 
      success: true, 
      razorpayOrder: razorpayOrderData,
      keyId: razorpayKeyId 
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return c.json({ 
      error: `Failed to create Razorpay order: ${error.message}`,
      suggestion: "Please try again or use Cash on Delivery option."
    }, 500);
  }
});

// Verify Razorpay payment
app.post("/make-server-08603d78/payment/verify-razorpay", async (c) => {
  try {
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeySecret) {
      return c.json({ error: "Razorpay secret not configured" }, 500);
    }

    const body = await c.req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return c.json({ error: "Missing payment verification data" }, 400);
    }

    // Verify signature
    const crypto = await import("node:crypto");
    const hmac = crypto.createHmac("sha256", razorpayKeySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Payment signature verification failed");
      return c.json({ error: "Invalid payment signature" }, 400);
    }

    // Update order payment status
    const order = await kv.get(`order:${orderId}`);
    if (order) {
      const updatedOrder = {
        ...order,
        paymentStatus: "paid",
        status: "confirmed",
        paymentDetails: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          paidAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };
      await kv.set(`order:${orderId}`, updatedOrder);
      
      console.log(`Payment verified for order: ${orderId}`);
      return c.json({ success: true, order: updatedOrder });
    }

    return c.json({ error: "Order not found" }, 404);
  } catch (error) {
    console.error("Error verifying payment:", error);
    return c.json({ error: `Payment verification failed: ${error.message}` }, 500);
  }
});

// Complete COD order
app.post("/make-server-08603d78/payment/confirm-cod", async (c) => {
  try {
    const body = await c.req.json();
    const { orderId } = body;

    if (!orderId) {
      return c.json({ error: "Order ID is required" }, 400);
    }

    const order = await kv.get(`order:${orderId}`);
    
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    if (order.paymentMethod !== "cod") {
      return c.json({ error: "This order is not a COD order" }, 400);
    }

    const updatedOrder = {
      ...order,
      status: "confirmed",
      paymentStatus: "pending", // Will be paid on delivery
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, updatedOrder);
    
    console.log(`COD order confirmed: ${orderId}`);
    return c.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error confirming COD order:", error);
    return c.json({ error: `Failed to confirm order: ${error.message}` }, 500);
  }
});

// ==================== PAYMENT STATISTICS ====================

// Get payment statistics
app.get("/make-server-08603d78/payment/stats", async (c) => {
  try {
    const orders = await kv.getByPrefix("order:");
    
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      codOrders: orders.filter(o => o.paymentMethod === "cod").length,
      onlineOrders: orders.filter(o => o.paymentMethod !== "cod").length,
      paidOrders: orders.filter(o => o.paymentStatus === "paid").length,
      pendingPayments: orders.filter(o => o.paymentStatus === "pending" || o.paymentStatus === "awaiting_payment").length,
    };
    
    return c.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    return c.json({ error: `Failed to fetch stats: ${error.message}` }, 500);
  }
});

// ==================== AI FEATURES ====================

// Get personalized product recommendations
app.get("/make-server-08603d78/ai/recommendations", async (c) => {
  try {
    const userId = c.req.query("userId");
    const location = c.req.query("location");
    const limit = parseInt(c.req.query("limit") || "6");
    
    const recommendations = await ai.generateRecommendations(userId, location, limit);
    
    return c.json({ success: true, recommendations });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return c.json({ error: `Failed to generate recommendations: ${error.message}` }, 500);
  }
});

// Get vendor insights and analytics
app.get("/make-server-08603d78/ai/vendor-insights/:vendorId", async (c) => {
  try {
    const { vendorId } = c.req.param();
    
    if (!vendorId) {
      return c.json({ error: "Vendor ID is required" }, 400);
    }
    
    const insights = await ai.generateVendorInsights(vendorId);
    
    return c.json({ success: true, insights });
  } catch (error) {
    console.error("Error generating vendor insights:", error);
    return c.json({ error: `Failed to generate insights: ${error.message}` }, 500);
  }
});

// Get demand predictions for vendor
app.get("/make-server-08603d78/ai/demand-prediction/:vendorId", async (c) => {
  try {
    const { vendorId } = c.req.param();
    const days = parseInt(c.req.query("days") || "30");
    
    if (!vendorId) {
      return c.json({ error: "Vendor ID is required" }, 400);
    }
    
    const predictions = await ai.predictDemand(vendorId, days);
    
    return c.json({ success: true, predictions });
  } catch (error) {
    console.error("Error predicting demand:", error);
    return c.json({ error: `Failed to predict demand: ${error.message}` }, 500);
  }
});

// AI Chat Assistant
app.post("/make-server-08603d78/ai/chat", async (c) => {
  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openaiApiKey || openaiApiKey.trim() === '') {
      return c.json({ 
        error: "AI chat is not available. OpenAI API key not configured.",
        suggestion: "Please configure your OpenAI API key to use the AI assistant." 
      }, 503);
    }
    
    const body = await c.req.json();
    const { message, userId, conversationHistory = [] } = body;
    
    if (!message) {
      return c.json({ error: "Message is required" }, 400);
    }
    
    // Get context about the user's orders and available vendors
    const context = await ai.getChatContext(userId);
    
    // Prepare system message with context
    const systemMessage = `You are Ghartak AI Assistant, a helpful chatbot for a hyperlocal grocery delivery platform called Ghartak. 
    
Your role is to:
- Help users find vendors and products
- Track orders and provide order status
- Answer questions about the platform
- Provide product recommendations
- Help with any issues or concerns

Current platform context:
- Total orders in system: ${context?.totalOrders || 0}
${userId ? `- User's order count: ${context?.userOrderCount || 0}` : ''}
- Available vendors: ${context?.availableVendors?.join(', ') || 'Various local vendors'}

Be friendly, concise, and helpful. If you don't know something specific about an order or vendor, acknowledge it and suggest the user check their order history or contact support.`;

    // Build conversation for OpenAI
    const messages = [
      { role: "system", content: systemMessage },
      ...conversationHistory,
      { role: "user", content: message },
    ];
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      return c.json({ 
        error: `AI service error: ${errorData}`,
        suggestion: "Please try again later."
      }, response.status);
    }
    
    const aiResponse = await response.json();
    const assistantMessage = aiResponse.choices[0]?.message?.content;
    
    if (!assistantMessage) {
      return c.json({ error: "No response from AI" }, 500);
    }
    
    console.log(`AI chat response generated for user: ${userId || 'anonymous'}`);
    return c.json({ 
      success: true, 
      message: assistantMessage,
      conversationHistory: [
        ...conversationHistory,
        { role: "user", content: message },
        { role: "assistant", content: assistantMessage },
      ],
    });
  } catch (error) {
    console.error("Error in AI chat:", error);
    return c.json({ error: `AI chat failed: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);