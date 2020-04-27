const express = require("express"),
    router = express.Router({ mergeParams: true }), // keeps req.params values
    User = require("../models/user");

// RESET PASSWORD ROUTE
router.get("/reset", (req, res) => {
    res.render("reset");
})

// CHANGE PASSWORD ROUTE - check to ensure username and email address are correct, then ensure both passwords match before resetting
router.post("/", function (req, res) {
    User.findOne({ username: req.body.username }, (err, user) => {
        // Check to ensure username is in the db
        if (user == null) {
            return res.render("login_register", { "error": "No user by that name found!" });
        }
        // Check to ensure entered email address matches username
        if (user.email != req.body.email) {
            return res.render("login_register", { "error": "Email address incorrect!" });
        }
        // Check to ensure password and password check matched
        if (req.body.password !== req.body.passwordCheck) {
            return res.render("login_register", { "error": "Passwords do not match!" });
        }
        // Reset the actual password in the db!!! *********************
        user.setPassword(req.body.password, function (err, user) {
            if (err) {
                return res.render("login_register", { "error": "Password could not be changed!" });
            }
            user.save(); // save the new password
            res.render("login_register", { "success": "Password has been successfully reset!" });
        })
    });
});

module.exports = router; // export the router paths