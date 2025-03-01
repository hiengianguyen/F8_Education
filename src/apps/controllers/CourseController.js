const Course = require("../models/CourseModel");
const Lesson = require("../models/LessonModel");
const splitGetID = require("../../until/extractVideoIdFromUrl");
const { mongooseToObject, multipleMongooseToObject } = require("../../until/mongooseFunctions");
const { removeVI } = require("jsrmvi");
const { nanoid } = require("nanoid");

class CourseController {
  // [GET] /courses/:slug
  async show(req, res, next) {
    let detailCourse = await Course.findOne({ slug: req.params.slug })
      .then((course) =>  course)
      .catch((err) => next(err));

    const lessons = await Lesson.find({ courseId: detailCourse._id }).sort('order')
        .then((lessons) => lessons)
        .catch((err) => next(err));
    
    const currentLesson = lessons.find((lesson) => lesson.order === 1);
      
    return res.render("courses/show", {
      course: mongooseToObject(detailCourse),
      lessons: multipleMongooseToObject(lessons),
      currentLesson: currentLesson.toObject(),
      currentLessonOrder: currentLesson.order,
      fullName: req.session.fullName,
      avatar: req.session.avatarUrl,
      isStudent: req.session.role,
    })
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

  // [GET] /courses/:id/edit
  edit(req, res, next) {
    Course.findById(req.params.id)
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

  // [PUT] /courses/:id
  update(req, res, next) {
    Course.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/me/stored/courses"))
      .catch((err) => next(err));
  }

  // [DELETE] /courses/:id
  softDelete(req, res, next) {
    Course.updateOne({ _id: req.params.id }, { $set: { isDeleted: true } })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [PATCH] /courses/:id/restore
  restore(req, res, next) {
    Course.updateOne({ _id: req.params.id }, { $set: { isDeleted: false } })
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
  // [DELETE] /courses/:id
  hardDelete(req, res, next) {
    Course.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
}

module.exports = new CourseController();
