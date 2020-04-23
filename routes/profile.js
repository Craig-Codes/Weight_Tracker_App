const express = require("express"),
    router = express.Router({ mergeParams: true }), // keeps req.params values from index routes
    middleware = require("../middleware"),
    User = require("../models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

// PROFILE SHOW ROUTE - edit profile page
router.get("/profile/edit", middleware.isLoggedIn, function (req, res) {
    // currentUser is used to pre-populate the fields for the user
    res.render("editProfile", { currentUser: req.user });
});

// PROFILE UPDATE ROUTE - update profile page
router.put("/profile", middleware.isLoggedIn, function (req, res) {
    User.findByIdAndUpdate({ _id: req.user.id }, { age: req.body.age, gender: req.body.gender, heightFt: req.body.heightFt, heightIn: req.body.heightIn, email: req.body.email },
        function (err, updatedUser) {
            if (err) {
                res.redirect("back");
            } else {
                req.flash("success", "Profile Updated!");
                res.redirect("/profile");
            }
        })
});

module.exports = router; // export the router paths