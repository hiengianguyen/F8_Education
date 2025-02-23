const { mongooseToObject } = require("../../until/mongooseFunctions");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const Handlebars = require("handlebars");

class AuthController {
  // [GET] /sign-up
  signUpShow(req, res) {
    res.render("auth/sign-up");
  }

  // [GET] /sign-in
  signInShow(req, res) {
    res.render("auth/sign-in");
  }

  // [POST] /sign-up
  signUp(req, res) {
    try {
      const { fullName, email, password, phoneNumber } = req.body;
      User.findOne({ email: email }).then((user) => {
        if (!user) {
          const salt = bcrypt.genSaltSync(10);
          const hashPassword = bcrypt.hashSync(password, salt);
          const user = new User({
            fullName,
            email,
            phoneNumber,
            password: hashPassword,
          });
          user.save();
          res.redirect("/auth/sign-in");
        } else {
          res.render("auth/sign-up", {
            fullNameInput: fullName,
            emailInput: email,
            phoneNumberInput: phoneNumber,
            messageEmailInput: "Email vừa nhập đã tồn tại!",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // [POST] /sign-in
  signIn(req, res) {
    const { email, password } = req.body;

    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          const checkPassword = bcrypt.compareSync(password, user.password);
          if (checkPassword) {
            req.session.isLogin = true;
            req.session.userId = user._id;
            req.session.fullName = user.fullName;

            res.redirect("/home");
          } else {
            res.render("auth/sign-in", {
              valueEmailInput: email,
              messagePassInput: "Mật khẩu vừa nhập không đúng!",
            });
          }
        } else {
          res.render("auth/sign-in", {
            valueEmailInput: email,
            messageEmailInput: "Email vừa nhập không tồn tại!",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // [GET]
  signOut(req, res) {
    req.session.isLogin = false;
    res.redirect("/");
  }
}

module.exports = new AuthController();
