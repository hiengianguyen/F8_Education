const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

class AuthController {
  // [GET] /register
  registerUser(req, res) {
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
      res.json(user);
    } catch (error) {
      console.log(error);
    }
  }
  
}

module.exports = new AuthController();
