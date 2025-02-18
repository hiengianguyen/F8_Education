const Course = require("../models/Course");
const {
  multipleMongooseToObject
} = require("../../until/mongooseFunctions");

class SiteController {
  // [GET] /
  index(req, res, next) {
    Course.find({ isDeleted: false })
      .then((courses) => {
        res.render("home", {
          courses: multipleMongooseToObject(courses),
        });
      })
      .catch((err) => next(err));
  }
  
  // [GET] /search
  search(req, res, next) {
    Course.find({})
      .then((courses) => {
        let filteredCourses = courses;
        if (req.query.keyword) {
          const keyword = req.query.keyword.toLowerCase().trim();
          filteredCourses = courses.filter(
            (course) =>
              course.name.toLowerCase().includes(keyword) ||
              course.slug.includes(keyword)
          );
        }
        res.render("search", {
          courses: multipleMongooseToObject(filteredCourses),
          inputValue: req.query.keyword,
        });
      })
      .catch((err) => res.redirect("/search"));
  }

  }

module.exports = new SiteController();
