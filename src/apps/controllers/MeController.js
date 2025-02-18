const Course = require("../models/Course");
const { multipleMongooseToObject } = require("../../until/mongooseFunctions");

class MeController {
  // [GET] /me/stored/courses
  storedCourses(req, res, next) {
    Promise.all([
      Course.find({ isDeleted: false }).sortable(req),
      Course.countDocuments({ isDeleted: true }),
    ])
      .then(([courses, deleteCount]) => {
        res.render("me/stored-courses", {
          deleteCount: deleteCount,
          courses: multipleMongooseToObject(courses),
        });
      })
      .catch(next);
  }

  // [GET] /me/trash/courses
  trashCourses(req, res, next) {
    Course.find({ isDeleted: true })
      .then((courses) => {
        res.render("me/trash-courses", {
          courses: multipleMongooseToObject(courses),
        });
      })
      .catch(next);
  }
}

module.exports = new MeController();
