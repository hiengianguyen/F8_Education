const express = require('express');
const router = express.Router();

const siteController = require('../apps/controllers/SiteController');

router.use('/search', siteController.search);
router.use('/', siteController.index);

module.exports = router;
