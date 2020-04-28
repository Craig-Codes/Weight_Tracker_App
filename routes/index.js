const express = require("express"),
  router = express.Router(), // new isntance of the express router... all routes are added to it, then its exported.
  passport = require("passport"),
  profileFunctions = require("../public/js/profile"),
  middleware = require("../middleware"), // because the middleware file is called index.js, we dont need to explicitly put / index.js at the end as express will look here by default
  moment = require('moment'), // outputs date information nicely in different formats
  User = require("../models/user"),
  Weight = require("../models/weights");

// AUTH ROUTES - Register - Post from the register form handles Sign-up logic
router.post("/register", async (req, res) => {
  // Create a new user object using form input, then pass into register function, provided by passport
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    age: req.body.age,
    gender: req.body.gender,
    heightFt: req.body.heightFt,
    heightIn: req.body.heightIn,
    weight: req.body.weight,
  });

  if (req.body.password !== req.body.passwordCheck) { // Check to ensure passwords match, if not return to login screen
    req.flash("error", "Error, ensure passwords match correctly!");
    return res.redirect("/");
  }
  try {
    const user = await User.register(newUser, req.body.password); // after user creation, await new weight creation
    const newlyCreatedWeight = await Weight.create({ weight: req.body.weight, date: Date.now() });
    newlyCreatedWeight.save(); // Push new weight object into the users weights object array creating the reference in the db
    user.weights.push(newlyCreatedWeight)
    user.save(); // Save the User object with the weight inside, saving data into the db
    req.login(user, (err) => {
      req.flash("success", `You have successfully registered ${req.body.username}, Welcome!`);
      return res.redirect("/profile");
    });
  }
  catch (err) {
    console.log(err);
    req.flash("error", "Username already taken, please choose a different username!");
    return res.redirect("/");
  }
});

// AUTH ROUTES - Login
router.post(
  "/login",
  // Authenticate using passport.js, using the local protocal
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true,
    failureFlash: 'Invalid username or password!' //Throw in an error message saying user name or p/w incorrect
  }),
  function (req, res) {
    res.redirect("/profile");
  },
);

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
  req.logout(); // passport method, logging out the current user
  req.flash("success", "Logged out successfully!")
  res.redirect("/");
});

//INDEX Route - gets user stats for BMI, a list of the most recent 5 weights for the user and renders the Graph with the data provided
router.get("/profile", middleware.isLoggedIn, async (req, res) => {
  // Find the current user, and use populate to get the Weights Schema data associated with that user
  try {
    const foundUser = await User.findById(req.user.id).populate("weights").exec();
    let weightsArray = []; // stores all weights associated with the user
    let resultsArray = []; // stores all weights correctly formatted
    let revArray = []; // reverses the resultsArray for correct output
    let chartWeight = []; // Stores Line Graph weight data
    let chartDate = []; // Stores line Graph date data

    resultsArray = foundUser.weights;
    // loops through the users weights object array, passing the results into an object
    resultsArray.forEach((entry) => {
      let objectToPush = {
        id: entry.id,
        weight: entry.weight,
        date: moment(entry.date).format("lll") // using moment.js to format date output
      };
      let chartWeightObjectToPush = entry.weight;
      let chartDateObjectToPush = moment(entry.date).format("DD/MM/YY");
      // pass the formatted object into a new array, storing all found objects correctly formatted
      weightsArray.push(objectToPush);
      chartWeight.push(chartWeightObjectToPush);
      chartDate.push(chartDateObjectToPush);
    })
    // Reverse the array so that the most recent entries become the first entries, allowing a for loop to be used in the template to display 5 most recent weights
    revArr = weightsArray.reverse();
    let firstWeight = revArr[0].weight; // get the first weight, as the most recent to be used in bmi calculation
    // function expressions used to calculate the BMI, and to control BMI output
    let bmi = profileFunctions.bmi(firstWeight, req.user.heightFt, req.user.heightIn); // Get BMI score
    let color = profileFunctions.bmiColor(bmi); // Get BMI colour
    // Pass variables into the template
    res.render("profile", { currentUser: req.user, bmi: bmi, color: color, weights: revArr, chartDate: chartDate, chartWeight: chartWeight }); // pass variables into template
  }
  catch (err) {
    console.log(err);
    req.flash("error", "Unable to render user profile!");
    return res.redirect("back");
  }
});

// Root path - app landing page (Login / Register form)
router.get("/", (req, res) => {
  res.render("login_register"); // render the landing.ejs page. Always put ejs files inside the View directory as this is where express looks!
});

// Default Route always returns back to the login screen
router.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = router; // export the router paths
