const { multipleMongooseToObject } = require("../../until/mongooseFunctions");
const { searchCourses } = require("../../until/searchCourses");

class SiteController {
  // [GET] /home
  async index(req, res, next) {
    // Return courses with keyword is undefined
    const courses = await searchCourses(
      req.session.userId,
      req.session.role,
      undefined
    );
    if (req.session.isLogin) {
      res.render("index", {
        courses: multipleMongooseToObject(courses),
        isSearch: req.session.isSearch,
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
    let coursesList = await searchCourses(
      req.session.userId,
      req.session.role,
      req.body.keyword
    );
    req.session.customData = coursesList;
    res.redirect("/search/result");
  }

  // [GET] /search/result
  async searchResult(req, res, next) {
    if (req.session.isLogin) {
      let courses = req.session.customData;

      res.render("index", {
        courses: courses,
        isSearch: false,
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
