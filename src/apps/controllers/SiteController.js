const Course = require("../models/CourseModel");
const { multipleMongooseToObject } = require("../../until/mongooseFunctions");

class SiteController {
  // [GET] /home
  index(req, res, next) {
    if (req.session.isLogin) {
      Course.find({ isDeleted: false })
        .then((courses) => {
          res.render("index", {
            courses: multipleMongooseToObject(courses),
            fullName: req.session.fullName,
          });
        })
        .catch(next);
    } else {
      res.redirect("/");
    }
  }

  // [GET] /search
  search(req, res, next) {
    if (req.session.isLogin) {
      Course.find({ isDeleted: false })
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
          res.render("courses/search", {
            courses: multipleMongooseToObject(filteredCourses),
            inputValue: req.query.keyword,
            fullName: req.session.fullName,
          });
        })
        .catch((err) => res.redirect("/search"));
    } else {
      res.redirect("/");
    }
  }
}

module.exports = new SiteController();
