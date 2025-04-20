const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

// MongoDB connection
const connectMongo = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe_orders');
      console.log('Order Service connected to MongoDB');
      break;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      retries--;
      if (retries === 0) throw error;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};
connectMongo().catch(console.error);

// Order Schema
const orderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  customerId: Number,
  items: [{ menuItemId: Number, name: String, price: Number, quantity: Number }],
  total: Number,
  status: String,
});

const Order = mongoose.model('Order', orderSchema);

app.post('/orders', async (req, res) => {
  const { customerId, items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid items' });
  }

  try {
    // Validate customer if provided
    if (customerId) {
      const customerResponse = await axios.get(`${process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3005'}/customers/${customerId}`);
      if (!customerResponse.data) {
        return res.status(400).json({ error: 'Customer not found' });
      }
    }

    // Validate items with Menu Service
    const menuResponse = await axios.get(`${process.env.MENU_SERVICE_URL || 'http://localhost:3001'}/menu`);
    const menuItems = menuResponse.data;

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ error: `Menu item ${item.menuItemId} not found` });
      }
      if (menuItem.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${menuItem.name}` });
      }
      orderItems.push({ menuItemId: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: item.quantity });
      total += menuItem.price * item.quantity;
    }

    const orderCount = await Order.countDocuments();
    const order = new Order({
      id: orderCount + 1,
      customerId,
      items: orderItems,
      total,
      status: 'pending',
    });
    await order.save();

    // Update inventory
    await axios.post(`${process.env.INVENTORY_SERVICE_URL || 'http://localhost:3004'}/inventory/update`, { items });

    // Update loyalty points if customer exists
    if (customerId) {
      await axios.post(`${process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3005'}/customers/update-points`, {
        customerId,
        points: Math.floor(total),
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/orders/:id', async (req, res) => {
  const order = await Order.findOne({ id: parseInt(req.params.id) });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.listen(port, () => {
  console.log(`Order Service running on port ${port}`);
});