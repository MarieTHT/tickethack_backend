var express = require("express");
var router = express.Router();
const moment = require("moment");

const Trip = require("../models/trips");

/* GET trips listing. */
router.get("/", (req, res) => {
  Trip.find().then((trips) => {
    res.json({ trips });
  });
});

router.post("/byDate", (req, res) => {
  const from = req.body.departure;
  const to = req.body.arrival;
  const date = req.body.date;
  const dateTimestamp = new Date(date);
  console.log(dateTimestamp);

  Trip.find({
    departure: { $regex: new RegExp(from, "i") },
    arrival: { $regex: new RegExp(to, "i") },
    date: {$gte: dateTimestamp }
    })
    .then((trips) => {
        res.json({ trips });
    });

});

module.exports = router;
