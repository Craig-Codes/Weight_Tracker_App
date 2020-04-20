const profileFunctions = require("../public/js/profile");

const middlewareObj = {}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Permission denied, please login first!");
    res.redirect("/");
}

module.exports = middlewareObj;