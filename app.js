const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  ejs = require("ejs"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  passportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user"),
  Weight = require("./models/weights"),
  flash = require("connect-flash");

// DB SETUP
mongoose.set("useUnifiedTopology", true);
const url = "mongodb://localhost/weight_tracker";
mongoose
  .connect(url, {
    //created an environmental variable... if on goorm, run local db, if on heroku run production db. To setup on Heroku go into app on heroku, settings, config vars. Then add the name of the variable, so DATABASEURL and make it equal the full url string with password. Also keeps password out of files and hidden
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to DB!");
  })
  .catch((err) => {
    console.log("Error: ", err.message);
  }); // will create the yelp_database for us inside mongodb dynamically

mongoose.set("useFindAndModify", false);

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "NoPainNoGain GetToTheChoppa",
    resave: false, // have to add these two options
    saveUninitialized: false,
  })
);

// APP SETUP
app.use(bodyParser.urlencoded({ extended: true })); // tells app to use bodyParser for post requests, and sets some setting up
app.use(methodOverride("_method")); // need for PUT Requests - hmtl forms only actually support get and post, but REST conventions require a PUT on update
app.set("view engine", "ejs"); // This line means the express now expects ejs template files by default, so we dont need to add .ejs e.g landing.ejs can be called simply landing
app.use(express.static(__dirname + "/public")); // adding custom stylesheet - use __dirname to ensure the directory is always correct incase it changes for whatever reason - this serves the style public directory, but you still need to link to it in the header file!
app.use(flash()); // Tells app to use flash for flash messages

//middleware passing the currentUser variable in all templates 
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error"); // passes the 'message' varaible into every template... necessary as flash messages are in the header of every template so avoids message is undefined errors
  res.locals.success = req.flash("success")
  next(); // need to move middlewear on
});

app.use(passport.initialize()); // tells node to use passport
app.use(passport.session()); // tells node to use passport

passport.use(new LocalStrategy(User.authenticate())); // The authenticate method comes from passportLocalMongoose so we dont ahve to write it. User localStategy form of authenticate... can chage this to facebooke, google etc.
passport.serializeUser(User.serializeUser()); // methods required to take data from the session and encoding (serialize) and unecoding data (deserialise) - methods automatically added to User Schema as added into user.js
passport.deserializeUser(User.deserializeUser());

// ROUTE SETUP - Add the route files and tell express to use these routes as part of the router
const weightsRoutes = require("./routes/weights");
const indexRoutes = require("./routes/index"); // require the index routes
const profileRoutes = require("./routes/profile");
app.use(weightsRoutes);
app.use(indexRoutes);
app.use(profileRoutes);

// required for server to listen on port 3000 - server always has to listen to something!
app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Weight Tracker Server has started - Server listening on port 3000"
  );
});
