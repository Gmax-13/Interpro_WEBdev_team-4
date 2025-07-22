const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number
  },
  phone: String,
  email: String,
  mission: String,
  facilities: [String],
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
  services: [String]
});

module.exports = mongoose.model('Clinic', clinicSchema);
