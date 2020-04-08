const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  ejs = require("ejs");

// DB SETUP
//mongoose.set("useUnifiedTopology", true);

//const url = "mongodb://localhost/weight_tracker";

// mongoose
//   .connect(url, {
//     //created an environmental variable... if on goorm, run local db, if on heroku run production db. To setup on Heroku go into app on heroku, settings, config vars. Then add the name of the variable, so DATABASEURL and make it equal the full url string with password. Also keeps password out of files and hidden
//     useNewUrlParser: true,
//     useCreateIndex: true,
//   })
//   .then(() => {
//     console.log("connected to DB!");
//   })
//   .catch((err) => {
//     console.log("Error: ", err.message);
//   }); // will create the yelp_database for us inside mongodb dynamically

// mongoose.set("useFindAndModify", false);

// APP SETUP
app.set("view engine", "ejs"); // This line means the express now expects ejs template files by default, so we dont need to add .ejs e.g landing.ejs can be called simply landing
app.use(express.static(__dirname + "/public")); // adding custom stylesheet - use __dirname to ensure the directory is always correct incase it changes for whatever reason - this serves the style public directory, but you still need to link to it in the header file!
//seedDB(); // Seeds the Database everytime this file is run... comment out for persistant data

// ROUTE SETUP
const indexRoutes = require("./routes/index"); // require the index routes
app.use(indexRoutes);

// required for server to listen on port 3000 - server always has to listen to something!
app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Weight Tracker Server has started - Server listening on port 3000"
  );
});
