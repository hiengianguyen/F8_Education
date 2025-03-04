const mongoose = require("mongoose");
const Course = require("../models/CourseModel");
const Lesson = require("../models/LessonModel");
const splitGetID = require("../../until/extractVideoIdFromUrl");
const {
  mongooseToObject,
  multipleMongooseToObject,
} = require("../../until/mongooseFunctions");
const { nanoid } = require("nanoid");
const { removeVI } = require("jsrmvi");

class CourseController {
  // [GET] /courses/:slug
  async show(req, res, next) {
    const detailCourse = await Course.findOne({ slug: req.params.slug })
      .then((course) => course)
      .catch((err) => next(err));

    const lessons = await Lesson.find({ courseId: detailCourse._id })
      .sort("order")
      .then((lessons) => lessons)
      .catch((err) => next(err));

    if (lessons.length === 0) {
      return res.render("courses/show", {
        course: mongooseToObject(detailCourse),
        isDontHaveLesson: true,
        fullName: req.session.fullName,
        avatar: req.session.avatarUrl,
        isStudent: req.session.role,
      });
    } else {
      let currentLesson;
      const currentLessonId = req.query.current;
      if (currentLessonId) {
        currentLesson = lessons.find((lesson) => lesson._id == currentLessonId);
      } else {
        currentLesson = lessons.find((lesson) => lesson.order == 1);
      }

      return res.render("courses/show", {
        course: mongooseToObject(detailCourse),
        lessons: multipleMongooseToObject(lessons),
        currentLesson: currentLesson.toObject(),
        isDontHaveLesson: false,
        fullName: req.session.fullName,
        avatar: req.session.avatarUrl,
        isStudent: req.session.role,
      });
    }
  }

  // [GET] /courses/create
  create(req, res) {
    if (req.session.isLogin) {
      res.render("courses/create", {
        fullName: req.session.fullName,
        avatar: req.session.avatarUrl,
        isStudent: req.session.role,
      });
    } else {
      res.redirect("/");
    }
  }

  // [POST] /courses/store
  async store(req, res, next) {
    const formData = req.body;
    formData.slug = removeVI(req.body.name) + "-" + nanoid(4);
    formData.videoId = splitGetID(req.body.videoUrl);
    formData.createdBy = req.session.userId;
    const courses = new Course(formData);

    await Course.insertMany([courses])
      .then(() => res.redirect("/me/stored/courses"))
      .catch((err) => next(err));
  }

  // [GET] /courses/:courseId/edit
  edit(req, res, next) {
    Course.findById(req.params.courseId)
      .then((course) => {
        res.render("courses/edit", {
          course: mongooseToObject(course),
          fullName: req.session.fullName,
          avatar: req.session.avatarUrl,
          isStudent: req.session.role,
        });
      })
      .catch(next);
  }

  // [PUT] /courses/:courseId
  update(req, res, next) {
    Course.updateOne({ _id: req.params.courseId }, req.body)
      .then(() => res.redirect("/me/stored/courses"))
      .catch((err) => next(err));
  }

  // [DELETE] /courses/:courseId
  softDelete(req, res, next) {
    Course.updateOne(
      { _id: req.params.courseId },
      { $set: { isDeleted: true } }
    )
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [PATCH] /courses/:courseId/restore
  restore(req, res, next) {
    Course.updateOne(
      { _id: req.params.courseId },
      { $set: { isDeleted: false } }
    )
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [POST] /courses/handle-method-course
  handleMethod(req, res, next) {
    switch (req.body.action) {
      case "softDelete":
        Course.updateMany(
          { _id: { $in: req.body.courseIds } },
          { $set: { isDeleted: true } }
        )
          .then(() => res.redirect("back"))
          .catch(next);
        break;
      case "hardDelete":
        Course.deleteMany({ _id: { $in: req.body.courseIds } })
          .then(() => res.redirect("back"))
          .catch(next);
        break;
      case "restore":
        Course.updateMany(
          { _id: { $in: req.body.courseIds } },
          { $set: { isDeleted: false } }
        )
          .then(() => res.redirect("back"))
          .catch(next);
        break;

      default:
        res.json({ message: "Action is invalid" });
    }
  }
  // [DELETE] /courses/:courseId
  hardDelete(req, res, next) {
    Course.deleteOne({ _id: req.params.courseId })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [GET] /courses/:courseId/edit/lessons
  async showEditListLessons(req, res) {
    const courseId = req.params.courseId;

    const course = await Course.findOne({
      _id: new mongoose.Types.ObjectId(courseId),
    })
      .then((course) => course)
      .catch((err) => next(err));

    const lessons = await Lesson.find({
      courseId: course._id,
      isDeleted: false,
    })
      .sort("order")
      .then((lessons) => lessons)
      .catch((err) => next(err));

    res.render("courses/lessons/editListLessons", {
      course: mongooseToObject(course),
      lessons: multipleMongooseToObject(lessons),
      lessonsCount: lessons.length,
      fullName: req.session.fullName,
      avatar: req.session.avatarUrl,
      isStudent: req.session.role,
    });
  }

  // [GET] /courses/:courseId/edit/lessons/:lessonId
  async showEditDetailLesson(req, res) {
    const courseId = req.params.courseId;
    const course = await Course.findOne({
      _id: new mongoose.Types.ObjectId(courseId),
    })
      .then((course) => course)
      .catch((err) => next(err));

    const lessonId = req.params.lessonId;
    const currentLesson = await Lesson.findOne({
      _id: new mongoose.Types.ObjectId(lessonId),
    })
      .then((lesson) => lesson)
      .catch((err) => next(err));

    res.render("courses/lessons/editDetailLesson", {
      course: mongooseToObject(course),
      currentLesson: mongooseToObject(currentLesson),
      fullName: req.session.fullName,
      avatar: req.session.avatarUrl,
      isStudent: req.session.role,
    });
  }

  async updateLesson(req, res, next) {
    try {
      const formData = req.body;
      formData.videoId = splitGetID(req.body.videoUrl);
      const editListLessonsUrl =
        "/courses" + req.path.split("lessons/")[0] + "lessons";
      await Lesson.updateOne({ _id: req.params.lessonId }, formData);
      res.redirect(editListLessonsUrl);
    } catch (err) {
      next(err);
    }
  }

  // [GET] /courses/:courseId/edit/lessons/add
  async showCreateLesson(req, res) {
    const courseId = req.params.courseId;
    const currentOrder = Number(req.query.currentOrder) + 1;
    const course = await Course.findOne({
      _id: new mongoose.Types.ObjectId(courseId),
    }).then((course) => course);

    res.render("courses/lessons/createDetailLesson", {
      currentOrder: currentOrder,
      course: mongooseToObject(course),
      fullName: req.session.fullName,
      avatar: req.session.avatarUrl,
      isStudent: req.session.role,
    });
  }

  // [POST] /courses/:courseId/edit/lessons/add
  async createLesson(req, res, next) {
    try {
      const formData = req.body;
      formData.courseId = new mongoose.Types.ObjectId(req.params.courseId);
      formData.order = Number(req.query.currentOrder) + 1;
      formData.videoId = splitGetID(req.body.videoUrl);
      const lesson = new Lesson(formData);
      await Lesson.insertMany([lesson]);
      res.redirect(`/courses/${req.params.courseId}/edit/lessons`);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CourseController();
