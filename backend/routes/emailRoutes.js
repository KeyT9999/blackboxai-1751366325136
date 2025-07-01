const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/:accountId', isAuthenticated, emailController.fetchEmails);

module.exports = router;
