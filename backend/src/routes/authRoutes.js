const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController-memory');
const { auth } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
// TODO: Add forgot/reset password endpoints

router.patch('/profile', auth, authController.updateProfile);

module.exports = router;
