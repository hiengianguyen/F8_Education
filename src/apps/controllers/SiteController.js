const mongoose = require("mongoose");
const Course = require("../models/CourseModel");
const RegisteredCourse = require("../models/RegisteredCourseModel");
const { multipleMongooseToObject } = require("../../utils/mongooseFunctions");
const { searchCourses } = require("../../utils/searchCourses");

class SiteController {
  // [GET] /home

  async index(req, res, next) {
    if (req.session.isLogin) {
      let userRegisteredCourses, registeredCourseIds;
      const registeredCourses = await RegisteredCourse.find({
        userId: new mongoose.Types.ObjectId(req.session.userId)
      });
      if (registeredCourses) {
        registeredCourseIds = registeredCourses.map(
          (registeredCourse) => registeredCourse.courseId
        );
        const userRegisteredCoursesArr = await Course.find({
          _id: { $in: registeredCourseIds }
        });
        userRegisteredCourses = userRegisteredCoursesArr;
      } else {
        userRegisteredCourses = [];
      }
      const nonRegisteredCourses = await Course.find({
        _id: { $nin: registeredCourseIds }
      });

      res.render("index", {
        courses: multipleMongooseToObject(nonRegisteredCourses),
        registeredCourse: multipleMongooseToObject(userRegisteredCourses),
        isSearch: req.session.isSearch,
        fullName: req.session.fullName,
        avatar: req.session.avatarUrl,
        isStudent: req.session.role
      });
    } else {
      res.redirect("/");
    }
  }

  // [POST] /search
  async search(req, res, next) {
    let coursesList = await searchCourses(
      req.session.userId,
      req.session.role,
      req.body.keyword
    );
    req.session.customData = coursesList;
    res.redirect(`/search/result?keyword=${req.body.keyword}`);
  }

  // [GET] /search/result
  async searchResult(req, res, next) {
    if (req.session.isLogin) {
      let courses = req.session.customData;

      res.render("index", {
        courses: courses,
        isSearch: false,
        keyword: req.query.keyword,
        fullName: req.session.fullName,
        avatar: req.session.avatarUrl,
        isStudent: req.session.role
      });
    } else {
      res.redirect("/");
    }
  }
}

module.exports = new SiteController();
