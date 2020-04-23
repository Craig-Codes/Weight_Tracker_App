const profileFunctions = require("../public/js/profile");

const middlewareObj = {}

// function uses passport.js's authenticate method to check if a user is logged in
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Permission denied, please login first!");
    res.redirect("/");
}

module.exports = middlewareObj;