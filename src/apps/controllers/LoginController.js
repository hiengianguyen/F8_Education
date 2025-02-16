class LoginController {
    // [GET] /
    index(req, res) {
        res.render('login');
    }
    // [GET] /store
    store(req, res) {
        res.redirect('/');
    }
}

module.exports = new LoginController();