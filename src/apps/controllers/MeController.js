const Course = require("../models/CourseModel");
const User = require("../models/UserModel");
const {
  mongooseToObject,
  multipleMongooseToObject,
} = require("../../until/mongooseFunctions");

class MeController {
  showProfile(req, res, next) {
    const userId = req.session.userId;
    User.findOne({ _id: userId }).then((user) => {
      res.render("me/profile", {
        user: mongooseToObject(user),
      });
    });
  }

  showEditProfile(req, res, next) {
    const userId = req.session.userId;
    User.findOne({ _id: userId }).then((user) => {
      res.render("me/edit-profile", {
        user: mongooseToObject(user),
      });
    });
  }

  updateProfile(req, res, next) {
    const { email, fullName } = req.body;
    User.findOne({ _id: req.session.userId })
      .then((user) => {
        if (email != user.email) {
          User.findOne({ email: email }).then((user) => {
            if (!user) {
              User.updateOne({ _id: req.session.userId }, req.body).then(() => {
                req.session.userName = fullName;
                res.redirect("/me/profile");
              });
            } else {
              res.locals.isProfile = false;
              res.render("me/edit-profile", {
                user: req.body,
                messageEmailInput: "Email vừa nhập đã tồn tại!",
              });
            }
          });
        } else {
          User.updateOne({ _id: req.session.userId }, req.body).then(() => {
            req.session.userName = fullName;
            res.redirect("/me/profile");
          });
        }
      })
      .catch((error) => next(error));
  }

  // [GET] /me/stored/courses
  storedCourses(req, res, next) {
    if (req.session.isLogin) {
      Promise.all([
        Course.find({ isDeleted: false }).sortable(req),
        Course.countDocuments({ isDeleted: true }),
      ])
        .then(([courses, deleteCount]) => {
          res.render("me/stored-courses", {
            deleteCount: deleteCount,
            courses: multipleMongooseToObject(courses),

            userName: req.session.userName,
          });
        })
        .catch(next);
    } else {
      res.redirect("/");
    }
  }

  // [GET] /me/trash/courses
  trashCourses(req, res, next) {
    Course.find({ isDeleted: true })
      .then((courses) => {
        res.render("me/trash-courses", {
          courses: multipleMongooseToObject(courses),
          userName: req.session.userName,
        });
      })
      .catch(next);
  }
}

module.exports = new MeController();
