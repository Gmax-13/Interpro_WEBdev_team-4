const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { auth, role } = require('../middleware/auth');

// Upsert doctor profile (doctor only)
router.post('/profile', auth, role(['doctor']), doctorController.upsertDoctor);

// Get all doctors
router.get('/', doctorController.getDoctors);

// Get doctor by ID
router.get('/:id', doctorController.getDoctorById);

module.exports = router;
