const Course = require("../models/Course");
const { multipleMongooseToObject } = require("../../until/mongoose");

class SiteController {
  index(req, res, next) {
    Course.find({})
      .then((courses) => {
        res.render("home", {
          courses: multipleMongooseToObject(courses),
        });
      })
      .catch((err) => next(err));
  }

  search(req, res) {
    Course.find({})
      .then((courses) => {
            res.render("search", {
              courses: multipleMongooseToObject(courses),
            });
            if(req.query.q) {
              const searchArticles = (query) => {
                const keyword = query.toLowerCase().trim();
                return courses.filter(course => 
                  course.name.toLowerCase().includes(keyword) || 
                    course.slug.includes(keyword)
                );
              }
              console.log("Code: ",searchArticles(req.query.q))
            }
        })
      .catch((err) => next(err))
  }
}

module.exports = new SiteController();
