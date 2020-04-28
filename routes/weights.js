const express = require("express"),
    router = express.Router({ mergeParams: true }), // keeps req.params values
    middleware = require("../middleware"),
    User = require("../models/user"),
    Weight = require("../models/weights"),
    moment = require('moment'),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

//Route new weights are posted to. Adds the weight to the db then redirect back to profile
router.post("/profile", middleware.isLoggedIn, async (req, res) => { // async function
    try {
        const foundUser = await User.findById(req.user.id); // find the user, await db response
        const newWeight = await Weight.create({ weight: req.body.weight, date: Date.now() }); // create a weight, await db response
        newWeight.save(); // save the new weight into db
        foundUser.weights.push(newWeight) // push the new weight into the foundUser's weight array
        foundUser.save(); // save the found user
        req.flash("success", "New weight successfully added!");
        res.redirect("/profile");
    } catch (err) { // catch any error from the try block
        console.log(err);
        req.flash("error", "Unable to create new weight!");
        res.redirect("/profile");
    }
});

// Show route for ALL weights
router.get("/profile/weights", middleware.isLoggedIn, async (req, res) => {
    try {
        // find the user from the db, and populate their weights array from references, asyn so that user is found first
        const foundUser = await User.findById(req.user.id).populate("weights").exec();
        let weightsArray = []; // stores all found weights
        let resultsArray = []; // stores all found weights correctly formatted
        let revArray = []; // reverses order of formatted array ready for template
        resultsArray = foundUser.weights;
        // loops through the users weights object array, passing the results into an object
        resultsArray.forEach(function (entry) {
            let objectToPush = {
                id: entry.id,
                weight: entry.weight,
                date: moment(entry.date).format("llll") // using moment.js to format date output
            };
            // pass the formatted object into a new array, storing all found objects correctly formatted
            weightsArray.push(objectToPush);
        })
        // Reverse the array so that the most recent entries become the first entries
        revArr = weightsArray.reverse();
        console.log("reverseArray ===== ", revArr);
        res.render("weights", { currentUser: req.user, weights: revArr });
    }
    catch (err) {
        console.log(err);
        req.flash("error", "Route could not be found!");
        return res.redirect("back");
    }
});

// EDIT Route for individual weights
router.get("/profile/weights/:id/edit", middleware.isLoggedIn, async (req, res) => {
    try { // Ensure the correct user is logged in so that no one else has access the current users weights
        const foundUser = await User.findById(req.user.id).populate("weights").exec(); // wait until user is found
        const foundWeight = await Weight.findById(req.params.id); // wait until weight is found
        // correctly format the found data, using moment.js to control how date is output
        let weightObject = {
            _id: foundWeight.id,
            weight: foundWeight.weight,
            date: moment(foundWeight.date).format('LLLL'),
        };
        res.render("editWeights", { currentUser: req.user, weight: weightObject });;
    }
    catch (err) {
        console.log(err);
        req.flash("error", "Weight could not be found!");
        res.redirect("back");
    }
});

// UPDATE ROUTE - use findByIdAndUpdate mongoose method to easily update the new weight
router.put("/profile/weights/:id", middleware.isLoggedIn, (req, res) => {
    Weight.findByIdAndUpdate({ _id: req.params.id }, { weight: req.body.updatedWeight }, (err, newWeight) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Weight successfully updated!");
            res.redirect("/profile");
        }
    })
});

//DESTROY ROUTE - Destroy from both db collections (reference in User, and actual object in Weights), ensuring we always have one weight to use for BMI calculation
router.delete("/profile/weights/:id", middleware.isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("weight").exec(); // wait for user to be found
        if (user.weights.length > 1) { // Ensure there is always 1 weight remaining - used to calculate BMI
            user.weights.pull(req.params.id) // pull the weight matching the request id, then save
            user.save();
            const deletedWeight = await Weight.findByIdAndRemove(req.params.id);
            req.flash("error", "Weight has been deleted!");
            res.redirect("/profile");
        }
        else { // If only one weight found, tell user it cannot be deleted
            req.flash("error", "Final weight cannot be deleted!");
            res.redirect("/profile");
        }
    }
    catch (err) {
        console.log(err);
        req.flash("error", "Weight not found!");
        res.redirect("back");
    }
});

module.exports = router; // export the router paths