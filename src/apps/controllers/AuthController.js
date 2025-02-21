const { mongooseToObject } = require("../../until/mongooseFunctions");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

class AuthController {
   // [GET] /sign-up
  signUpShow(req, res) {
    res.render('auth/sign-up');
  }

// [GET] /sign-in
  signInShow(req, res) {
      res.render('auth/sign-in');
  }

  // [GET] /sign-up
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
      req.session.isLogin = true;
      res.redirect("/home");
    } catch (error) {
      console.log(error);
    }
  }

  // [POST] /sign-in
  signIn(req, res) {
    const { email, password } = req.body;
 
      const user = User
      .findOne({ email: email })
      .then((user) => {
        if (user) {
          const checkPassword = bcrypt.compareSync(password, user.password);
          if (checkPassword) {
            req.session.isLogin = true;
            res.redirect("/home");
          } else {
            res.json({ message: "Password is incorrect" });
          }
        } else {
          res.json({ message: "Email is not exist" });
        }
      })
     .catch((error) => {
        console.log(error);
      });
  }

  signOut(req, res) {
    req.session.isLogin = false;
    res.redirect("/")
  }

  
}

module.exports = new AuthController();
