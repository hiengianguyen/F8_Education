const express = require("express");
const router = express.Router();
const siteController = require("../apps/controllers/SiteController");

router.get("/home", siteController.index);
router.post("/search", siteController.search);
router.get("/search/result", siteController.searchResult);

module.exports = router;
