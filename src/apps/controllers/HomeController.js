
class HomeController {
  // [GET] /
  index(req, res) {
    res.render("home-page");
   
  }

  
}

module.exports = new HomeController();
