const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  service: { type: String },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g., '09:00-09:30'
  status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
