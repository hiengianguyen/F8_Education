const Course = require("../models/Course");
const { mongooseToObject } = require("../../until/mongoose");

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
    console.log("code run");
    const formData = req.body;
    formData.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
    const course = new Course(formData);

    await course
      .save()
      .then((savedCourse) => console.log(savedCourse))
      .catch((err) => {
        console.log("ERRORRRRRRRRRRR");
      });

    await res.redirect("/");
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
  destroy(req, res, next) {
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
      case "delete":
        Course.updateMany(
          { _id: { $in: req.body.courseIds } },
          { $set: { isDeleted: true } }
        )
          .then(() => res.redirect("back"))
          .catch(next);
        break;
      default:
        res.json({ message: "Action is invalid" });
    }
  }
}

module.exports = new CourseController();
