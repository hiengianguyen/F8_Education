const Course = require("../models/CourseModel");
const { multipleMongooseToObject } = require("../../until/mongooseFunctions");
const { removeVI } = require("jsrmvi");


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

      if(req.session.courses != [] && req.session.courses ) {
        console.log(req.session.courses != [])
        res.render("index", {
          courses: req.session.courses,
            fullName: req.session.fullName,
            avatar: req.session.avatarUrl,
            isStudent: req.session.role,
        })
      } else {
        Course.find(queryFindCourse)
        .then((courses) => {
          res.render("index", {
            courses: multipleMongooseToObject(courses),
            fullName: req.session.fullName,
            avatar: req.session.avatarUrl,
            isStudent: req.session.role,
          });
          req.session.courses = multipleMongooseToObject(courses);
        })
        .catch(next);
      }
    } else {
      res.redirect("/");
    }
  }

  // [POST] /search
  search(req, res, next) {
    let courses = req.session.courses;
    const keyword = removeVI(req.body.keyword, { replaceSpecialCharacters: false });
          courses = courses.filter(
            (course) =>
              course.name.toLowerCase().includes(keyword) ||
              course.slug.includes(keyword)
          );

          req.session.courses = courses;
    res.redirect("/home")
  }
}

module.exports = new SiteController();
