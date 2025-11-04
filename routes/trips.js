var express = require("express");
var router = express.Router();
const Trip = require("../models/trips");

/* GET trips listing. */
router.get("/", function(req, res) {
  Trip.find()
    .then(function(trips) {
      res.json({ trips: trips });
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).json({ error: "Erreur serveur" });
    });
});

/* POST trips by date */
router.post("/byDate", function(req, res) {
  var from = req.body.departure;
  var to = req.body.arrival;
  var date = req.body.date;

  // Vérification des champs
  if (!from || !to || !date) {
    return res.status(400).json({ error: "Tous les champs doivent être remplis !" });
  }

  var dateTimestamp = new Date(date);

  if (isNaN(dateTimestamp.getTime())) {
    return res.status(400).json({ error: "Date invalide !" });
  }

  Trip.find({
    departure: { $regex: new RegExp(from, "i") },
    arrival: { $regex: new RegExp(to, "i") },
    date: { $gte: dateTimestamp }
  })
  .then(function(trips) {
    if (!trips || trips.length === 0) {
      return res.status(404).json({ message: "Aucun voyage trouvé" });
    }
    res.json({ trips: trips });
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});

module.exports = router;
