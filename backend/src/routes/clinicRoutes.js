const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');
const { auth, role } = require('../middleware/auth');

// Upsert clinic profile (admin only)
router.post('/profile', auth, role(['admin']), clinicController.upsertClinic);

// Get all clinics
router.get('/', clinicController.getClinics);

// Get clinic by ID
router.get('/:id', clinicController.getClinicById);

module.exports = router;
