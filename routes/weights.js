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
            res.redirect("/profile");
        }
    });

    // User.findById(req.user._id, function (err, user) {
    //     if (err) {
    //         console.log(err);
    //         res.redirect("/profile");
    //     } else {
    //         // console.log(user);
    //         console.log(user.weight);
    //         console.log(user.weights);
    //         // user.weights.push({
    //         user.weight = req.body.weight;
    //         user.weights.unshift(user.weight);
    //         console.log(user.weight);
    //         //     date: Date.now(),
    //         // });
    //         user.save();
    //         res.redirect("/profile");
    //     }
    // });
});

module.exports = router; // export the router paths