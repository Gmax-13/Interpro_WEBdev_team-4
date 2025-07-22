const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Example route
app.get('/', (req, res) => res.send('API running!'));

const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;

// Temporarily bypass MongoDB connection for testing
console.log('Starting server without MongoDB (using in-memory storage)...');
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using in-memory storage for user data (temporary solution)');
});
