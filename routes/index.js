const express = require("express");
const router = express.Router(); // new isntance of the express router... all routes are added to it, then its exported.
const passport = require("passport");
const User = require("../models/user");
const profileFunctions = require("../public/js/profile");
const middleware = require("../middleware"); // because the middleware file is called index.js, we dont need to explicityl put / index.js at the end as express will look here by default
const moment = require('moment');

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
router.get("/profile", middleware.isLoggedIn, function (req, res) {
  let bmi = profileFunctions.bmi(req.user.weight, req.user.heightFt, req.user.heightIn, req.user.age); // send user details to BMI calc function
  let color = profileFunctions.bmiColor(bmi);

  //let weights = profileFunctions.weightShow(req.user.username);
  //console.log(weights);
  // console.log("weights first entry varaible from index.js", weights[0].weight);
  // PUT THIS INSIDE MONGO QUERY PROMISE!!!

  let weightsArray = []; // stores mongodb query result from the find.
  let query = [
    User.findOne({ "username": req.user.username }, function (err, result) {
      if (err) {
        console.log(err);
      } // result is returned as a promise obejct from a mongodb find. Passed as 'result' to the promise
    })
  ];

  Promise.all(query).then(result => {
    //console.log("result[0].weights ====", result[0].weights);
    let resultsArray = result[0].weights;
    resultsArray.forEach(function (entry) {
      let objectToPush = {
        id: entry.id,
        weight: entry.weight,
        date: moment(entry.date).format("lll") // using moment.js to format date output
      };
      weightsArray.push(objectToPush); // Creating new array objects with required key value pairs.
    })
  }).then(() => {
    let revArr = weightsArray.reverse(); // reversing the array so that new entries appear first
    console.log("Weights array reversed ======================", revArr);
    res.render("profile", { currentUser: req.user, bmi: bmi, color: color, weights: revArr }); // pass variables into template
  }).catch(err => {
    console.error('Error fetching data:', err)
  });
});



// <!--<% for(var i=0; i<5; i++) {%> -->
//   <!-- only show 5 in the list on profile page, show all on show page -->
//   <!--<li><%= JSON.stringify(weights[i].weight) %>lbs at <%= JSON.parse(JSON.stringify(weights[i].date)) %></li> -->
//   <!--<% } %> -->

// NEW Route
// router.get("/profile/new", function (req, res) {
//   res.render("new", { currentUser: req.user });
// });

//CREATE Route
//router.post("/profile", function (req, res) {
//create weight
//res.redirect("/profile", { currentUser: req.user });
//});

module.exports = router; // export the router paths
