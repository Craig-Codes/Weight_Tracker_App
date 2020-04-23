const express = require("express"), // express framework
  app = express(),
  mongoose = require("mongoose"), // mongoose for intergrating MongoDB database
  ejs = require("ejs"), // ejs for templating 
  passport = require("passport"), // passport for user authentication
  LocalStrategy = require("passport-local"), // passport-local for local strategy methods and authentication of passport.js
  bodyParser = require("body-parser"), // to access form input data
  methodOverride = require("method-override"), // for CRUD - allows PUT and DELETE in HTML5
  passportLocalMongoose = require("passport-local-mongoose"), // simplified passport intergration with MongoDB
  User = require("./models/user"), // User Schema
  flash = require("connect-flash"); // flash messages

// DB SETUP
mongoose.set("useUnifiedTopology", true);
let url = process.env.DATABASEURL; // Environmental variable, setup on Heroku
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to DB!"); // Lets me know Database is conencted correcly, and authentication was successful on Atlas Mongo Cloud
  })
  .catch((err) => {
    console.log("Error: ", err.message);
  });

mongoose.set("useFindAndModify", false);

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: process.env.SECRET, // Enviromental variable stored on Heroku
    resave: false,
    saveUninitialized: false,
  })
);

// APP SETUP
app.use(bodyParser.urlencoded({ extended: true })); // tells app to use bodyParser for post requests, to get the form data
app.use(methodOverride("_method")); // need for PUT & DELETE Requests - hmtl forms only actually support get and post, but REST conventions require a PUT on update
app.set("view engine", "ejs"); // Express now expects EJS template files by default, so we dont need to add .ejs
app.use(express.static(__dirname + "/public")); // adding custom stylesheet - use __dirname to ensure the directory is always correct  - this serves the style public directory, but you still need to link to it in the header file!
app.use(flash()); // Tells app to use flash for flash messages

//middleware passing the currentUser variable in all templates 
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error"); // passes the 'message' variable into every template... necessary as flash messages are in the header of every template so avoids message is undefined errors
  res.locals.success = req.flash("success")
  next(); // need to move middlewear on
});

app.use(passport.initialize()); // tells node to use passport
app.use(passport.session()); // tells node to use passport session - we now always know who is logged in, passport deals with all the session information for us

passport.use(new LocalStrategy(User.authenticate())); // The authenticate method comes from passportLocalMongoose so we dont have to write it
passport.serializeUser(User.serializeUser()); // methods required to take data from the session and encoding (serialize) and unecoding data (deserialise) - methods automatically added to User Schema as added into user.js
passport.deserializeUser(User.deserializeUser());

// ROUTE SETUP - Add the route files and tell express to use these routes - express router
const weightsRoutes = require("./routes/weights");
const indexRoutes = require("./routes/index");
const profileRoutes = require("./routes/profile");
const resetRoutes = require("./routes/reset");
app.use(weightsRoutes);
app.use(profileRoutes);
app.use(resetRoutes);
app.use(indexRoutes); // the default route is in the index, so this needs to be loaded in last

// required for server to listen on port 3000 for production and Heroku for deployment - server always has to listen to something!
app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Weight Tracker Server has started"
  );
});
