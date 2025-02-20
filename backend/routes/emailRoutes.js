const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Define the route and associate it with the controller function
router.post('/', emailController.sendEmail);

module.exports = router;
