const Course = require("../models/Course");
const {
  mongooseToObject,
  multipleMongooseToObject,
} = require("../../until/mongoose");
const e = require("express");

class MeController {
  // [GET] /me/stored/courses
  storedCourses(req, res, next) {
    Promise.all([
      Course.find({}).sortable(req),
      Course.countDocumentsDeleted({}),
    ])
      .then(([courses, deleteCount]) => {
        res.render("me/stored-courses", {
          deleteCount,
          courses: multipleMongooseToObject(courses),
        });
      })
      .catch(next);
  }

  // [GET] /me/trash/courses
  trashCourses(req, res, next) {
    Course.findDeleted({})
      .then((courses) => {
        res.render("me/trash-courses", {
          courses: multipleMongooseToObject(courses),
        });
      })
      .catch(next);
  }
}

module.exports = new MeController();
