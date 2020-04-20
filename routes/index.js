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
  // Create new user object then pass into register function
  let newUser = new User({
    username: req.body.username,
    age: req.body.age,
    gender: req.body.gender,
    heightFt: req.body.heightFt,
    heightIn: req.body.heightIn,
    weight: req.body.weight,
  });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      if (req.body.password !== req.body.passwordCheck) {
        req.flash("error", "Error, ensure passwords match correctly!");
        return res.redirect("/");
      } else {
        console.log(err);
        req.flash("error", "Username already taken, please choose a different username!");
        return res.redirect("/");
      };
    }
    // Create new weight for the user, utilisng the Weights Schema
    Weight.create({ weight: req.body.weight, date: Date.now() }, function (err, newlyCreatedWeight) {
      if (err) {
        req.flash("error", err);
        console.log(err);
      } else {
        newlyCreatedWeight.save(function (err) {
          console.log("weight saved into user");
          // Push new weight object into the users weights object array
          user.weights.push(newlyCreatedWeight)
          // Save the User object with the weight inside
          user.save(function (err) {
            console.log("new user created!");
            console.log("should render now");
            // Authenticate user so they are already signed in, saving the need to login straight away
            req.login(user, function (err) {
              if (err) {
                console.log(err);
              }
              else {
                req.flash("success", "You have successfully registered, Welcome!");
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
  // Authenticate using passport.js
  passport.authenticate("local", {
    successRedirect: "/profile", //Throw in an error message saying user name or p/w incorrect
    failureRedirect: "/",
    failureFlash: true,
    failureFlash: 'Invalid username or password!'
  }),
  function (req, res) {

    res.redirect("/profile");
  }
);

router.get("/test", function (req, res) {
  res.send("reached test route");
});

// LOGOUT ROUTE
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Logged out successfully!")
  res.redirect("/");
});

//INDEX Route -> gets user stats for BMI, and a list of the most recent 5 weights for the user
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
    resultsArray = foundUser.weights;
    // loops through the users weights object array, passing the results into an object
    resultsArray.forEach(function (entry) {
      let objectToPush = {
        id: entry.id,
        weight: entry.weight,
        date: moment(entry.date).format("lll") // using moment.js to format date output
      };
      // pass the formatted object into a new array, storing all found objects correctly formatted
      weightsArray.push(objectToPush);
    })
    // Reverse the array so that the most recent entries become the first entries, allowing a for loop to be used in the template to display 5 most recent weights
    revArr = weightsArray.reverse();
    console.log("reverseArray ===== ", revArr);
    //console.log("reverseArray ===== ", revArr[0].weight);
    let firstWeight = revArr[0].weight;
    // function expressions used to calculate the BMI, and to control BMI output
    let bmi = profileFunctions.bmi(firstWeight, req.user.heightFt, req.user.heightIn); // send user details to BMI calc function
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
