const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Customer = require("./models/Customer");
const Product = require('./models/Product');
const Bill = require('./models/Billing'); // Import Bill model
const billRoutes = require('./routes/billRoutes');
const visitRoutes = require('./routes/visitRoutes');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/optics", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ----------------- USER ROUTES -----------------

// Register
app.post("/api/register", async (req, res) => {
  const { name, mobile,email, shop, location, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name,mobile, email, shop, location, password });
    await newUser.save();

    res.json({ message: `Welcome to Optics, ${name}!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (user) {
      res.json({
        success: true,
        message: "Login successful",
        id: user._id,
        name: user.name,
        shop: user.shop,
      });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ----------------- CUSTOMER ROUTES -----------------

// Create customer
app.post("/api/customers", async (req, res) => {
  try {
    const { userId, name, phone, email, address,  eyePrescription } = req.body;

    const newCustomer = new Customer({
      owner: userId,
      name,
      phone,
      email,
      address,
      eyePrescription,
    });

    await newCustomer.save();
    res.status(200).json({ message: "Customer added successfully" });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ message: "Error saving customer" });
  }
});

// Get customers for a specific user
app.get("/api/customers/:ownerId", async (req, res) => {
  try {
    const customers = await Customer.find({ owner: req.params.ownerId });
    res.json(customers);
  } catch (err) {
    console.error("Failed to fetch customers:", err);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});

// Update customer by ID
app.put("/api/customers/:id", async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true, message: "Customer updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Failed to update customer" });
  }
});

// Delete customer by ID  FIXED
// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Error deleting customer', error });
  }
});


// product api 
// Get products for logged-in user only
app.get('/api/products', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const products = await Product.find({ userId });
    res.json(products);
  } catch (err) {
    console.error("GET /api/products error:", err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { userId } = req.body;

    // ✅ Validate
    if (!userId) {
      console.log("❌ userId missing in request body");
      return res.status(400).json({ error: 'Missing userId' });
    }

    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    console.error("POST /api/products error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("PUT /api/products error:", err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ====================================================================================================
// bills

app.post("/api/bills", async (req, res) => {
  const { userId, customerId, items, totalAmount } = req.body;

  if (!userId || !customerId || !items || !totalAmount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const bill = new Bill({
    userId,
    customerId,
    items,
    totalAmount,
    createdAt: new Date()
  });

  await bill.save();
  res.status(201).json(bill);
});


app.get("/api/bills", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  const bills = await Bill.find({ userId }).sort({ createdAt: -1 });
  res.json(bills);
});


// to print bill 

app.use('/api/bills', billRoutes);
app.use('/api/visits', visitRoutes);


// ----------------- START SERVER -----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
