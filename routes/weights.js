const express = require("express");
const router = express.Router();
const middleware = require("../middleware"); // because the middleware file is called index.js, we dont need to explicityl put / index.js at the end as express will look here by default
const User = require("../models/user");

//Route new weights are posted to. Add the weight to the db then redirect back to profile!
router.post("/profile", middleware.isLoggedIn, function (req, res) {
    console.log("add db adding logic here!!!");
    console.log(req.body);
    console.log(req.user._id);
    console.log(req.user.username);

    User.findOneAndUpdate({ "username": req.user.username }, {
        "weight": req.body.weight, // update the weight property so that BMI is updated
        $push: { // Add weight and date to array of weights
            "weights": {
                "weight": req.body.weight,
                "date": Date.now()
            }
        }
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.redirect("/profile");
        }
        else {
            console.log(result);
            console.log(result.weights)
            res.redirect("/profile");
        }
    });

});

router.get("/profile/weights", middleware.isLoggedIn, function (req, res) {
    res.send("weights index route reached");
})

module.exports = router; // export the router paths