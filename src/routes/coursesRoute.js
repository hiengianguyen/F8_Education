const express = require("express");
const router = express.Router();
const CourseController = require("../apps/controllers/CourseController");

router.get("/create", CourseController.create);
router.post("/store", CourseController.store);
router.get("/:id/edit", CourseController.edit);
router.post("/handle-method-course", CourseController.handleMethod);
router.put("/:id", CourseController.update);
router.patch("/:id/restore", CourseController.restore);
router.delete("/:id", CourseController.softDelete);
router.delete("/:id/delete", CourseController.hardDelete);
router.get("/:slug", CourseController.show);

module.exports = router;
