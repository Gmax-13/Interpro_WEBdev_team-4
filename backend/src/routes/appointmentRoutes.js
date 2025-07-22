const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { auth, role } = require('../middleware/auth');

// Book appointment (patient only)
router.post('/book', auth, role(['patient']), appointmentController.bookAppointment);

// Get patient appointments
router.get('/patient', auth, role(['patient']), appointmentController.getPatientAppointments);

// Get doctor appointments
router.get('/doctor', auth, role(['doctor']), appointmentController.getDoctorAppointments);

// Cancel appointment
router.patch('/cancel/:id', auth, appointmentController.cancelAppointment);

// Get available slots
router.get('/slots', auth, appointmentController.getAvailableSlots);

// Doctor appointment management routes
router.put('/:id/confirm', auth, role(['doctor']), appointmentController.confirmAppointment);
router.put('/:id/reject', auth, role(['doctor']), appointmentController.rejectAppointment);
router.put('/:id/reschedule', auth, role(['doctor']), appointmentController.rescheduleAppointment);
router.put('/:id/complete', auth, role(['doctor']), appointmentController.completeAppointment);

module.exports = router;
