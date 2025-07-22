const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req, res) => res.send('Test server running!'));

// Test auth routes
try {
  const authRoutes = require('./src/routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded successfully');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
  console.error('Stack trace:', error.stack);
}

const PORT = process.env.PORT || 5000;

console.log('Starting test server...');
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Using in-memory storage for user data');
});
