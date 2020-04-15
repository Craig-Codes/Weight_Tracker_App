const express = require("express");
const router = express.Router();
const middleware = require("../middleware"); // because the middleware file is called index.js, we dont need to explicityl put / index.js at the end as express will look here by default
const User = require("../models/user");
const moment = require('moment');

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


// Show route for ALL weights
router.get("/profile/weights", middleware.isLoggedIn, function (req, res) {
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
                date: moment(entry.date).format("LLLL") // using moment.js to format date output
            };
            weightsArray.push(objectToPush); // Creating new array objects with required key value pairs.
        })
    }).then(() => {
        let revArr = weightsArray.reverse(); // reversing the array so that new entries appear first
        console.log("Weights array reversed ======================", revArr);
        res.render("weights", { currentUser: req.user, weights: revArr }); // pass variables into template
    }).catch(err => {
        console.error('Error fetching data:', err)
    });
});

// EDIT Route for individual weights
router.get("/profile/weights/:id/edit", middleware.isLoggedIn, function (req, res) {
    res.send("reached edit route for weight");
})

module.exports = router; // export the router paths