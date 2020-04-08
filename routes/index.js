const express = require("express");
const router = express.Router(); // new isntance of the express router... all routes are added to it, then its exported.

// Root path - app landing page
router.get("/", function (req, res) {
  // request / response
  res.render("login_register"); // render the landing.ejs page. Always put ejs files inside the View directory as this is where express looks!
});

//INDEX Route
router.get("/:profile", function (req, res) {
  res.render("profile");
});

// AUTH ROUTES - LOGIN
router.post("/", function (req, res) {
  res.render("profile");
});

module.exports = router; // export the router paths
