const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Common proxy options with timeout settings
const proxyOptions = {
  changeOrigin: true,
  proxyTimeout: 10000,
  timeout: 10000,
  onError: (err, req, res) => {
    console.error(`Proxy error: ${err.message}`);
    res.status(500).json({ error: 'Service unavailable' });
  }
};

// Add health check endpoint for API gateway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Proxy routes to respective services
app.use('/menu', createProxyMiddleware({ 
  ...proxyOptions,
  target: process.env.MENU_SERVICE_URL || 'http://localhost:3001',
  pathRewrite: {'^/menu': ''}
}));

app.use('/orders', createProxyMiddleware({ 
  ...proxyOptions,
  target: process.env.ORDER_SERVICE_URL || 'http://localhost:3002',
  pathRewrite: {'^/orders': ''}
}));

app.use('/payments', createProxyMiddleware({ 
  ...proxyOptions,
  target: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003',
  pathRewrite: {'^/payments': ''}
}));

app.use('/inventory', createProxyMiddleware({ 
  ...proxyOptions,
  target: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3004',
  pathRewrite: {'^/inventory': ''}
}));

app.use('/customers', createProxyMiddleware({ 
  ...proxyOptions,
  target: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3005',
  pathRewrite: {'^/customers': ''}
}));

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});