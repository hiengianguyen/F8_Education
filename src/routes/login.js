const express = require('express');
const router = express.Router();
const loginController = require('../apps/controllers/LoginController');

router.get('/', loginController.index);
router.post('/store', loginController.store);

module.exports = router;