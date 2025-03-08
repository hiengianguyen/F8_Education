const mongoose = require("mongoose");
const Course = require("../models/CourseModel");
const User = require("../models/UserModel");
const RegisteredCourse = require("../models/RegisteredCourseModel");
const {
  mongooseToObject,
  multipleMongooseToObject
} = require("../../utils/mongooseFunctions");

class MeController {
  showProfile(req, res, next) {
    const userId = req.session.userId;
    User.findOne({ _id: userId }).then((user) => {
      res.render("me/profile", {
        user: mongooseToObject(user),
        fullName: req.session.fullName,
        avatar: req.session.avatarUrl,
        isStudent: req.session.role,
        role: user.role == "student" ? "Người Học" : "Người Dạy"
      });
    });
  }

  showEditProfile(req, res, next) {
    const userId = req.session.userId;
    User.findOne({ _id: userId }).then((user) => {
      res.render("me/edit-profile", {
        user: mongooseToObject(user),
        fullName: req.session.fullName,
        avatar: req.session.avatarUrl,
        isStudent: req.session.role
      });
    });
  }

  updateProfile(req, res, next) {
    const { email, fullName, avatar } = req.body;
    User.findOne({ _id: req.session.userId })
      .then((user) => {
        if (avatar) {
          req.session.avatarUrl = avatar;
        } else {
          req.body.avatar = user.avatar;
        }
        if (email != user.email) {
          User.findOne({ email: email }).then((user) => {
            if (!user) {
              User.updateOne({ _id: req.session.userId }, req.body).then(() => {
                res.redirect("/me/profile");
              });
            } else {
              res.locals.isProfile = false;
              res.render("me/edit-profile", {
                user: req.body,
                messageEmailInput: "Email vừa nhập đã tồn tại!"
              });
            }
          });
        } else {
          User.updateOne({ _id: req.session.userId }, req.body).then(() => {
            res.redirect("/me/profile");
          });
        }
        req.session.fullName = fullName;
      })
      .catch((error) => next(error));
  }

  // [GET] /me/stored/courses
  storedCourses(req, res, next) {
    if (req.session.isLogin) {
      Promise.all([
        Course.find({
          createdBy: req.session.userId,
          isDeleted: false
        }).sortable(req),
        Course.countDocuments({
          createdBy: req.session.userId,
          isDeleted: true
        })
      ])
        .then(([courses, deleteCount]) => {
          res.render("me/stored-courses", {
            deleteCount: deleteCount,
            courses: multipleMongooseToObject(courses),
            fullName: req.session.fullName,
            avatar: req.session.avatarUrl,
            isStudent: req.session.role
          });
        })
        .catch(next);
    } else {
      res.redirect("/");
    }
  }

  // [GET] /me/trash/courses
  trashCourses(req, res, next) {
    Course.find({ createdBy: req.session.userId, isDeleted: true })
      .then((courses) => {
        res.render("me/trash-courses", {
          courses: multipleMongooseToObject(courses),
          fullName: req.session.fullName,
          avatar: req.session.avatarUrl,
          isStudent: req.session.role
        });
      })
      .catch(next);
  }

  // [GET] /me/registered/courses
  async registeredCourses(req, res, next) {
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

      return res.render("me/registered-courses", {
        registeredCourse: multipleMongooseToObject(userRegisteredCourses),
        userId: req.session.userId,
        fullName: req.session.fullName,
        avatar: req.session.avatarUrl
      });
    }
  }

  async deleteRegisteredCourses(req, res, next) {
    const courseId = new mongoose.Types.ObjectId(req.body.courseId);
    const userId = new mongoose.Types.ObjectId(req.body.userId);

    await RegisteredCourse.deleteOne({ userId: userId, courseId: courseId });
    return res.redirect("/me/registered/courses");
  }

  // [POST] /me/handle-method-register
  async handleMethodRegister(req, res, next) {
    if (req.body.action === "unRegister") {
      const courseIds = req.body.courseIds.map(
        (courseId) => new mongoose.Types.ObjectId(courseId)
      );
      await RegisteredCourse.deleteMany({
        courseId: { $in: courseIds },
        userId: new mongoose.Types.ObjectId(req.body.userId)
      });
      return res.redirect("/me/registered/courses");
    }
  }
}

module.exports = new MeController();
