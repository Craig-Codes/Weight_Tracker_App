const express = require("express");
const router = express.Router({ mergeParams: true }); // keeps req.params values
const middleware = require("../middleware"); // because the middleware file is called index.js, we dont need to explicityl put / index.js at the end as express will look here by default
const User = require("../models/user");
const methodOverride = require("method-override");
flash = require("connect-flash");

// PROFILE SHOW ROUTE
router.get("/profile/edit", middleware.isLoggedIn, function (req, res) {
    res.render("editProfile", { currentUser: req.user });
});

// PROFILE UPDATE ROUTE
router.put("/profile", middleware.isLoggedIn, function (req, res) {
    User.findByIdAndUpdate({ _id: req.user.id }, { age: req.body.age, heightFt: req.body.heightFt, heightIn: req.body.heightIn },
        function (err, newWeight) {
            if (err) {
                res.redirect("back");
            } else {
                // FLASH User details Updated
                req.flash("success", "Profile Updated!");
                res.redirect("/profile");
            }
        })
});

module.exports = router; // export the router paths