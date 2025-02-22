class HomeController {
  // [GET] /
  index(req, res) {
    if (!req.session.isLogin) {
      res.render("home-page");
    } else {
      res.redirect("/home");
    }
  }
}

module.exports = new HomeController();
