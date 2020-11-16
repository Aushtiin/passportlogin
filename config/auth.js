module.exports = {
    enusreAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) return next();
        req.flash('error_msg', 'Please Log in')
        req.redirect('/users/login');
    }
}