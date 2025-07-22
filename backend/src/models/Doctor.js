const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specializations: [String],
  bio: String,
  photo: String, // URL or path to photo
  experience: Number,
  qualifications: [String],
  clinics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' }],
  services: [String],
  reviews: [{
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Doctor', doctorSchema);
