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

      if(req.session.courses == undefined || req.session.courses.length === 0) {
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
        res.render("index", {
          courses: req.session.courses,
          fullName: req.session.fullName,
          avatar: req.session.avatarUrl,
          isStudent: req.session.role,
        });
      }
    } else {
      res.redirect("/");
    }
  }

  // [POST] /search
  search(req, res, next) {
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
    let coursesList;
    const keyword = req.body.keyword.toLowerCase().trim();
    Course.find(queryFindCourse)
      .then((courses) => {
        coursesList = courses.filter(
          (course) =>
            course.name.toLowerCase().includes(keyword) ||
            course.slug.includes(keyword)
        );
        req.session.courses = coursesList;
        res.redirect("/home")
      })
          
  }
}

module.exports = new SiteController();
