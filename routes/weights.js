const express = require("express");
const router = express.Router({ mergeParams: true }); // keeps req.params values
const middleware = require("../middleware"); // because the middleware file is called index.js, we dont need to explicityl put / index.js at the end as express will look here by default
const User = require("../models/user");
const Weight = require("../models/weights");
const moment = require('moment');
const methodOverride = require("method-override");

//Route new weights are posted to. Add the weight to the db then redirect back to profile!
router.post("/profile", middleware.isLoggedIn, function (req, res) {
    console.log(req.user.username);
    console.log("req.body.weight==== ", req.body.weight);
    User.findById(req.user.id, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/profile");
        }
        else {
            Weight.create({ weight: req.body.weight, date: Date.now() }, function (err, newlyCreatedWeight) {
                if (err) {
                    console.log(err);
                } else {
                    newlyCreatedWeight.save();
                    user.weights.push(newlyCreatedWeight)
                    user.save();
                    res.redirect("/profile");
                }
            });
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
        res.render("weights", { currentUser: req.user, weights: revArr }); // pass variables into template
    }).catch(err => {
        console.error('Error fetching data:', err)
    });
});

// EDIT Route for individual weights
router.get("/profile/weights/:id/edit", middleware.isLoggedIn, function (req, res) {
    let weightResult = [];
    let query = [
        User.findOne({ "weights._id": req.params.id }, function (err, result) { //mongoose finds all results with a weights._id as its nested
            if (err) {
                console.log(err);
                res.redirect("back");
            }
        })
    ];
    Promise.all(query).then(result => {
        let queryResult = result[0].weights; // look through the results array, if entry id is equal to req.params, add that object to the weightResult array
        queryResult.forEach(entry => {
            if (entry._id == req.params.id) {
                let objectToPush = {
                    id: entry.id,
                    weight: entry.weight,
                    date: moment(entry.date).format("LLLL") // using moment.js to format date output
                }
                weightResult.push(objectToPush);
            }
        });
    })
        .then(() => {
            res.render("editWeights", { currentUser: req.user, weight: weightResult });
        }).catch(err => {
            console.error('Error fetching data:', err)
        });
});

// UPDATE ROUTE
// router.put("/profile/weights/:id", middleware.isLoggedIn, function (req, res) {
//     //db.users.find({"weights._id" :ObjectId("5e96cff921a62a296b071f34")}) --> 
//     //  db.users.find({_id:ObjectId('5e8f654bfd1b9e035f08d152')}) // --> works but only on user id not embedded id
//     // let weightResult = [];
//     console.log("req.user========", req.user);
//     let query = [
//         //     User.findOne({ "weights._id": req.params.id }, function (err, result) { //mongoose finds all results with a weights._id as its nested
//         //         if (err) {
//         //             console.log(err);
//         //             res.redirect("back");
//         //         }
//         //     })
//         //console.log("requst.params.id======", req.params.id);
//         User.findByIdAndUpdate(req.user._id, function (err, user) { // first find by username!
//             console.log("result ==== ", user);
//             let arrayFind = user.
//         })

//         // User.aggregate([{ // try using the aggregation framework???
//         //     $match:{"_id": ObjectId(req.user._id)}},

//         // ])
//     ];
//     Promise.all(query).then(result => {
//         // let queryResult = result[0].weights; // look through the results array, if entry id is equal to req.params, add that object to the weightResult array
//         // queryResult.forEach(entry => {
//         //     if (entry._id == req.params.id) {

//         //         entry._id = req.params.id,
//         //             entry.weight = 123,
//         //             entry.date = entry.date // using moment.js to format date output
//         //         //weightResult.push(objectToPush);
//         // }

//         // console.log(entry);
//         // }
//         // );
//     })
//         .then(() => {
//             res.send("updated???");
//             //res.render("editWeights", { currentUser: req.user, weight: weightResult });
//         }).catch(err => {
//             console.error('Error fetching data:', err)
//         });
// });




module.exports = router; // export the router paths