const express = require("express");
const router = express.Router();
const MeController = require("../apps/controllers/MeController");

router.get("/profile/edit", MeController.showEditProfile);
router.post("/profile/update", MeController.updateProfile);
router.get("/profile", MeController.showProfile);
router.get("/stored/courses", MeController.storedCourses);
router.get("/trash/courses", MeController.trashCourses);

module.exports = router;
