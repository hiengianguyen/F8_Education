const express = require("express");
const router = express.Router();
const CourseController = require("../apps/controllers/CourseController");

router.get("/create", CourseController.create);
router.post("/store", CourseController.store);
router.get("/:courseId/edit", CourseController.edit);
router.post("/handle-method-course", CourseController.handleMethod);
router.put("/:courseId", CourseController.update);
router.patch("/:courseId/restore", CourseController.restore);
router.delete("/:courseId", CourseController.softDelete);
router.delete("/:courseId/delete", CourseController.hardDelete);
router.get("/:slug", CourseController.show);
router.get("/:courseId/edit/lessons", CourseController.showEditListLessons);
router.get("/:courseId/edit/lessons/:lessonId", CourseController.showEditDetailLesson);
router.post("/:courseId/edit/lessons/:lessonId", CourseController.updateLesson);

module.exports = router;
