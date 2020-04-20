const express = require("express");
const router = express.Router({ mergeParams: true }); // keeps req.params values
const middleware = require("../middleware"); // because the middleware file is called index.js, we dont need to explicityl put / index.js at the end as express will look here by default
const User = require("../models/user");
const Weight = require("../models/weights");
const methodOverride = require("method-override");
const flash = require("connect-flash");

// RESET PASSWORD ROUTE
router.get("/reset", function(req, res){
    res.render("reset");
})

// CHANGE PASSWORD ROUTE
router.post("/", function(req, res){
    // Is username found?
    User.findOne({username: req.body.username}, function(err, user){
        // Check to ensure username is in the db
        if(user == null){
           return res.render("login_register", {"error":"No user by that name found!"});
        }
       // Check to ensure entered email address matches username
        if(user.email != req.body.email){
            return res.render("login_register", {"error":"Email address incorrect!"});
        }
        // Check to ensure password and password check matched
        if(req.body.password !== req.body.passwordCheck){
            return res.render("login_register", {"error":"Passwords do not match!"});
        }
        // Reset the actual password in the db!!! *********************
        user.setPassword(req.body.password, function(err, user){
            if(err){
                return res.render("login_register", {"error":"Password could not be changed!"});
            }
            user.save(); // save the new password
            res.render("login_register", {"success":"Password has been successfully reset!"});
        })
        
        });
    });

module.exports = router; // export the router paths