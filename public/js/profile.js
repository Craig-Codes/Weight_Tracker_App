const User = require("../../models/user");
const express = require("express");
const router = express.Router();
const moment = require('moment');

function bmi(weight, heightFt, heightIn) {
    let userHeightFtToIn = heightFt * 12;
    let userHeightIn = userHeightFtToIn + heightIn;
    let userHeightCalc = userHeightIn * userHeightIn;
    let bmiWeight = weight * 703;
    let bmiFullScore = bmiWeight / userHeightCalc;
    let bmiScore = bmiFullScore.toFixed(1);
    return bmiScore;
}

function bmiColor(bmi) {
    let color;
    if (bmi < 18.5) {
        color = "rgba(63, 165, 191, 0.55)" // light blue
    } else if (bmi < 25) {
        color = "rgba(63, 191, 89, 0.62)"; //green
    } else if (bmi < 30) {
        color = "rgba(244, 175, 26, 0.66)";
    } else {
        color = "rgba(223, 20, 20, 0.55)";
    }
    return color;
}

let revArr = []; //Global so that the variable is visible outside
function weightShow(username) {
    User.findOne({ "username": username }, function (err, result) {
        if (err) {
            console.log(err);
        }
        else { // Create a new array of objects without the id property
            let weightsArray = [];

            let resultsArray = result.weights;
            resultsArray.forEach(function (entry) {
                let objectToPush = {
                    weight: entry.weight,
                    date: moment(entry.date).format("DD-MM-YYYY"),
                }
                weightsArray.push(objectToPush);
            })
            revArr = weightsArray.reverse();
            console.log("======================", revArr);
            console.log(revArr[0]);
            console.log("revArray before return ====", revArr[0]);
        }
    });
    console.log("revArray before return ====", revArr[0]);
    return revArr;
}

module.exports = {
    bmi: bmi, // add in any other functions here
    bmiColor: bmiColor,
    weightShow: weightShow,
}
