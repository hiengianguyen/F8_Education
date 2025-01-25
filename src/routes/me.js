const express = require("express");
const router = express.Router();

const MeController = require("../apps/controllers/MeController");

router.get("/stored/courses", MeController.storedCourses);

module.exports = router;
