const Course = require("../models/Course");
const { mongooseToObject } = require("../../until/mongoose");
const generateSlug = require("../../until/slug");

class CourseController {
  // [GET] /courses/:slug
  show(req, res, next) {
    Course.findOne({ slug: req.params.slug })
      .then((course) => {
        res.render("courses/show", {
          course: mongooseToObject(course),
        });
      })
      .catch((err) => next(err));
  }

  // [GET] /courses/create
  create(req, res) {
    res.render("courses/create");
  }

  // [POST] /courses/store
  async store(req, res, next) {
    const formData = req.body;
    formData.slug = generateSlug(req.body.name);
    const courses = new Course(formData);

    console.log(courses);

    await Course.insertMany([courses])
      .then(() => res.redirect("/me/stored/courses"))
      .catch((err) => next(err))
  }

  // [GET] /courses/:id/edit
  edit(req, res, next) {
    Course.findById(req.params.id)
      .then((course) => {
        res.render("courses/edit", {
          course: mongooseToObject(course),
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
      case "restore":
      Course.updateMany(
        { _id: { $in: req.body.courseIds } },
        { $set: { isDeleted: false } }
      )
        .then(() => res.redirect("back"))
        .catch(next);
      break;

      case "hardDelete":
      Course.deleteMany(
        { _id: { $in: req.body.courseIds } }
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