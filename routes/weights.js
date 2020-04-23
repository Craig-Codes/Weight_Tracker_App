const express = require("express"),
    router = express.Router({ mergeParams: true }), // keeps req.params values
    middleware = require("../middleware"),
    User = require("../models/user"),
    Weight = require("../models/weights"),
    moment = require('moment'),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

//Route new weights are posted to. Adds the weight to the db then redirect back to profile
router.post("/profile", middleware.isLoggedIn, function (req, res) {
    //find the User first, then create a new weight and push it to the user to embed
    User.findById(req.user.id, function (err, user) {
        if (err) {
            return res.redirect("/profile");
        }
        Weight.create({ weight: req.body.weight, date: Date.now() }, function (err, newlyCreatedWeight) {
            if (err) {
                console.log(err);
            } else {
                newlyCreatedWeight.save();
                user.weights.push(newlyCreatedWeight)
                user.save();
                req.flash("success", "New weight successfully added!");
                res.redirect("/profile");
            }
        });
    });
});

// Show route for ALL weights
router.get("/profile/weights", middleware.isLoggedIn, function (req, res) {
    User.findById(req.user.id).populate("weights").exec(function (err, foundUser) {
        let weightsArray = []; // stores all found weights
        let resultsArray = []; // stores all found weights correctly formatted
        let revArray = []; // reverses order of formatted array ready for template

        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        resultsArray = foundUser.weights;
        // loops through the users weights object array, passing the results into an object
        resultsArray.forEach(function (entry) {
            let objectToPush = {
                id: entry.id,
                weight: entry.weight,
                date: moment(entry.date).format("LLLL") // using moment.js to format date output
            };
            // pass the formatted object into a new array, storing all found objects correctly formatted
            weightsArray.push(objectToPush);
        })
        // Reverse the array so that the most recent entries become the first entries
        revArr = weightsArray.reverse();
        console.log("reverseArray ===== ", revArr);
        res.render("weights", { currentUser: req.user, weights: revArr });
    });
});

// EDIT Route for individual weights
router.get("/profile/weights/:id/edit", middleware.isLoggedIn, function (req, res) {
    User.findById(req.user.id).populate("weights").exec(function (err, foundUser) {
        if (err) {
            return res.redirect("back");
        }
        // Find the individual weight based on the :id of the request
        Weight.findById(req.params.id, function (err, foundWeight) {
            if (err) {
                res.redirect("back");
            }
            else {
                // correctly format the found data, using moment.js to control how date is output
                let weightObject = {
                    weight: foundWeight.weight,
                    date: moment(foundWeight.date).format('LLLL'),
                };
                res.render("editWeights", { currentUser: req.user, weight: weightObject });;
            };
        });
    });
});

// UPDATE ROUTE
router.put("/profile/weights/:id", middleware.isLoggedIn, function (req, res) {
    Weight.findByIdAndUpdate({ _id: req.params.id }, { weight: req.body.updatedWeight }, function (err, newWeight) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Weight successfully updated!");
            res.redirect("/profile");
        }
    })
});

//DESTROY ROUTE - Destroy from both db collections, ensuring we always have one weight to use for BMI calculation
router.delete("/profile/weights/:id", middleware.isLoggedIn, function (req, res) {
    User.findById(req.user.id).populate("weight").exec(function (err, user) {
        if (err) {
            return console.log(err)
        }
        if (user.weights.length > 1) {
            console.log("user==== ", user);
            console.log(user.weights.length);
            user.weights.pull(req.params.id)
            user.save(function (err, updatedUser) {
                if (err) {
                    return console.log(err)
                }
                console.log(updatedUser.weights.length);
                // Remove the entry from weights collection in the db so both collections match
                Weight.findByIdAndRemove(req.params.id, function (err) {
                    if (err) {
                        res.redirect("back");
                    } else {
                        req.flash("error", "Weight has been deleted!");
                        res.redirect("/profile");
                    }
                });
            });
        }
        else {
            req.flash("error", "Final weight cannot be deleted!");
            res.redirect("/profile");
        }
    })
});

module.exports = router; // export the router paths