const express = require("express");
const router = express.Router();
const siteController = require("../apps/controllers/SiteController");

router.get("/home", siteController.index);

module.exports = router;
