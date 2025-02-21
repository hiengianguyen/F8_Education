class LoginController {
    // [GET] /
    index(req, res) {
        res.render('auth/login');
    }
    // [GET] /store
    store(req, res) {
        res.redirect('/');
    }
}

module.exports = new LoginController();