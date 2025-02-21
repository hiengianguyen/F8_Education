const express = require('express');
const router = express.Router();
const AuthController = require('../apps/controllers/AuthController');

router.post('/register', AuthController.registerUser);

module.exports = router;
