const { mongooseToObject } = require("../../until/mongooseFunctions");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

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
      const { fullName, email, password } = req.body;
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const user = new User({
        fullName,
        email,
        password: hashPassword,
      });
      user.save();
      res.redirect("/auth/sign-in");
    } catch (error) {
      console.log(error);
    }
  }

  // [POST] /sign-in
  signIn(req, res) {
    const { email, password } = req.body;

    const user = User.findOne({ email: email })
      .then((user) => {
        if (user) {
          const checkPassword = bcrypt.compareSync(password, user.password);
          if (checkPassword) {
            req.session.isLogin = true;
            res.redirect("/home");
          } else {
            res.render("auth/sign-in", {
              valueEmail: email,
              messagePassInput: "Mật khẩu vừa nhập không đúng!",
            });
          }
        } else {
          res.render("auth/sign-in", {
            messageEmailInput: "Email vừa nhập chưa đăng ký!",
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
