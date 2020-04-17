const express = require("express");
const router = express.Router(); // new isntance of the express router... all routes are added to it, then its exported.
const passport = require("passport");
const User = require("../models/user");
const profileFunctions = require("../public/js/profile");
const middleware = require("../middleware"); // because the middleware file is called index.js, we dont need to explicityl put / index.js at the end as express will look here by default
const moment = require('moment');
const Weight = require("../models/weights");

// AUTH ROUTES - Register

// Post from the register form. handles Sign-up logic
router.post("/register", function (req, res) {
  if (req.body.password !== req.body.passwordCheck) {
    return res.render("login_register");
    console.log("password doesn't match");
  }
  // Create new user
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
      return res.redirect("/");
    }
    // Create new weight for the user
    Weight.create({ weight: req.body.weight, date: Date.now() }, function (err, newlyCreatedWeight) {
      if (err) {
        console.log(err);
      } else {
        newlyCreatedWeight.save(function (err) {
          console.log("weight saved into user");
          user.weights.push(newlyCreatedWeight)
          user.save(function (err) {
            console.log("new user created!");
            console.log("should render now");
            // Authenticate user so they can sign straight in
            req.login(user, function (err) {
              if (err) {
                console.log(err);
              }
              else {
                return res.redirect("/profile");
              }
            })
          });
        });
      }
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

//INDEX Route -> get user stats for bmi, and a list of weights from weights array
router.get("/profile", middleware.isLoggedIn, function (req, res) {
  console.log("profile route hit");
  User.findById(req.user.id).populate("weights").exec(function (err, foundUser) {
    let weightsArray = [];
    let resultsArray = [];
    let revArray = [];
    if (err) {
      console.log(err);
      return res.redirect("back");
    }
    if (foundUser.weights[0] == null) {
      foundUser.weights[0].weight = 50;
    }
    console.log("foundUser populated ======", foundUser);
    resultsArray = foundUser.weights;
    console.log("resultsArray ==== ", resultsArray);
    resultsArray.forEach(function (entry) {
      let objectToPush = {
        id: entry.id,
        weight: entry.weight,
        date: moment(entry.date).format("lll") // using moment.js to format date output
      };
      //   //console.log("weights array ====== ", weightsArray);
      weightsArray.push(objectToPush); // Creating new array objects with required key value pairs.
      revArr = weightsArray.reverse(); // reversing the array so that new entries appear first
      console.log("Reversed array ====== ", revArr);

    })
    console.log("populated weights array ====== ", weightsArray);
    // let revArr = weightsArray.reverse(); // reversing the array so that new entries appear first
    // console.log("Reversed array ====== ", revArr);
    let bmi = profileFunctions.bmi(revArr[0].weight, req.user.heightFt, req.user.heightIn); // send user details to BMI calc function
    let color = profileFunctions.bmiColor(bmi);
    res.render("profile", { currentUser: req.user, bmi: bmi, color: color, weights: revArr }); // pass variables into template
  });
});

//NEW Route
router.get("/profile/new", function (req, res) {
  res.render("new", { currentUser: req.user });
});


// Root path - app landing page (Login / Register form)
router.get("/", function (req, res) {
  res.render("login_register"); // render the landing.ejs page. Always put ejs files inside the View directory as this is where express looks!
});

module.exports = router; // export the router paths
