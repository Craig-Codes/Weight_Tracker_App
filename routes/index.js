const express = require("express");
const router = express.Router(); // new isntance of the express router... all routes are added to it, then its exported.
const passport = require("passport");
const User = require("../models/user");
const profileFunctions = require("../public/js/profile");

const bmiCalc = 24;
// AUTH ROUTES - Register

// Post from the register form. handles Sign-up logic
router.post("/register", function (req, res) {
  console.log("register reached");
  let newUser = new User({
    username: req.body.username,
    age: req.body.age,
    gender: req.body.gender,
    heightFt: req.body.heightFt,
    heightIn: req.body.heightIn,
    weight: req.body.weight,
  });
  console.log("new user =====", newUser);
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("login_register");
    }
    console.log("db user =====", user);
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

// AUTH ROUTES - Login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile", //Throw in an error message saying user name or p/w incorrect
    failureRedirect: "/",
  }),
  function (req, res) {
    console.log("logged in");
    res.redirect("/profile");
    console.log(currentUser);
  }
);

router.get("/test", function (req, res) {
  res.send("reached test route");
});

// LOGOUT ROUTE
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// Root path - app landing page (Login / Register form)
router.get("/", function (req, res) {
  res.render("login_register"); // render the landing.ejs page. Always put ejs files inside the View directory as this is where express looks!
});

//INDEX Route
router.get("/profile", isLoggedIn, function (req, res) {
  let bmi = profileFunctions.bmi(req.user.weight, req.user.heightFt, req.user.heightIn, req.user.age); // send user details to BMI calc function
  let color = profileFunctions.bmiColor(bmi);
  res.render("profile", { currentUser: req.user, bmi: bmi, color: color });
});

// NEW Route
//router.get("/profile/new", function (req, res) {
//////res.render("new", { currentUser: req.user });
//});

//CREATE Route
//router.post("/profile", function (req, res) {
//create weight
//res.redirect("/profile", { currentUser: req.user });
//});

// Middlewear
//Checks to see if a user is logged in, if not kicks them back to the login screen - stops errors where user becomes undefined on page refresh
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router; // export the router paths
