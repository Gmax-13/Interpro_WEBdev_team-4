const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Get all notifications for user
router.get('/', auth, notificationController.getNotifications);
// Mark notification as read
router.patch('/:id/read', auth, notificationController.markAsRead);

module.exports = router;
