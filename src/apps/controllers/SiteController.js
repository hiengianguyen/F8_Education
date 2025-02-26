const Course = require("../models/CourseModel");
const { multipleMongooseToObject } = require("../../until/mongooseFunctions");

class SiteController {
  // [GET] /home
  index(req, res, next) {
    if (req.session.isLogin) {
      let queryFindCourse;
      switch (req.session.role) {
        case "student":
          queryFindCourse = {
            isDeleted: false,
          };

          break;
        case "teacher":
          queryFindCourse = {
            createdBy: req.session.userId,
            isDeleted: false,
          };
          break;
        default:
          queryFindCourse = {
            isDeleted: false,
          };
      }

      Course.find(queryFindCourse)
        .then((courses) => {
          res.render("index", {
            courses: multipleMongooseToObject(courses),
            fullName: req.session.fullName,
            avatar: req.session.avatarUrl,
            isStudent: req.session.role,
          });
        })
        .catch(next);
    } else {
      res.redirect("/");
    }
  }
}

module.exports = new SiteController();
