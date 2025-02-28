const Course = require("../models/CourseModel");
const { multipleMongooseToObject, mongooseToObject } = require("../../until/mongooseFunctions");
const { removeVI } = require("jsrmvi");
const { searchCourses } = require("../../until/searchCourses");


class SiteController {
  // [GET] /home
  async index(req, res, next) {
    // Return courses with keyword is undefined
    const courses = await searchCourses(req.session.role, undefined, req.session.userId);
    if (req.session.isLogin) {
          res.render("index", {
            courses: multipleMongooseToObject(courses),
            fullName: req.session.fullName,
            avatar: req.session.avatarUrl,
            isStudent: req.session.role,
          });
      
    } else {
      res.redirect("/");
    }
  }

  // [POST] /search
  async search(req, res, next) {
    let coursesList = await searchCourses(req.session.role, req.body.keyword, req.session.userId);
    req.session.customData = coursesList;
    res.redirect("/search/result");
  }

  // [GET] /search/result
  async searchResult(req, res, next) {
    if (req.session.isLogin) {
      let courses
    if(req.session.customData) {
      courses = req.session.customData;
    } else {
      courses = await searchCourses(req.session.role, undefined, req.session.userId);
    }
    res.render("index", {
      courses: courses,
      keyword: req.body.keyword,
      fullName: req.session.fullName,
      avatar: req.session.avatarUrl,
      isStudent: req.session.role,
    });
  } else {
    res.redirect("/");
  }
  }
}

module.exports = new SiteController();
