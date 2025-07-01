const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Local login route
router.post('/login', authController.login);

// Admin Microsoft OAuth2 login redirect
router.get('/microsoft', isAuthenticated, isAdmin, authController.microsoftLogin);

// OAuth2 callback route
router.get('/callback', authController.microsoftCallback);

// Logout route
router.post('/logout', isAuthenticated, authController.logout);

module.exports = router;
