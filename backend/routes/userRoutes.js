// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserProfile } = require('../controllers/userController');

// @route   GET /api/user/profile
// @desc    Get current logged-in user's profile
// @access  Private
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
