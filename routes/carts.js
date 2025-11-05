const express = require("express");
const router = express.Router();
const moment = require("moment");

const Trip = require("../models/trips");
const Cart = require("../models/carts");
const Booking = require("../models/bookings"); // si tu gères les réservations

/* GET cart listing */
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.session.userId }).populate("trips");

    if (!cart || cart.trips.length === 0) {
      return res.json({ trips: [], total: 0 });
    }

    const total = cart.trips.reduce((sum, trip) => sum + trip.price, 0);

    res.json({ trips: cart.trips, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* POST add trip to cart */
router.post("/add", async (req, res) => {
  try {
    const { tripId } = req.body;

    if (!tripId) {
      return res.status(400).json({ error: "tripId requis" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: "Trajet introuvable" });
    }

    // Récupérer le panier de l'utilisateur ou en créer un
    let cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart) {
      cart = new Cart({
        userId: req.session.userId,
        trips: [],
        total: 0,
        isBooking: false
      });
    }

    // Ajouter le trajet et recalculer le total
    cart.trips.push(trip._id);
    cart.total = cart.trips.length > 0 
      ? await Trip.find({ _id: { $in: cart.trips } })
          .then(trips => trips.reduce((sum, t) => sum + t.price, 0))
      : 0;

    await cart.save();

    res.json({ message: "Trajet ajouté au panier", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* DELETE a trip from cart */
router.delete("/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    const cart = await Cart.findOne({ userId: req.session.userId });

    if (!cart) return res.status(404).json({ error: "Panier introuvable" });

    cart.trips = cart.trips.filter(t => t.toString() !== tripId);

    // Recalculer le total
    cart.total = cart.trips.length > 0
      ? await Trip.find({ _id: { $in: cart.trips } })
          .then(trips => trips.reduce((sum, t) => sum + t.price, 0))
      : 0;

    await cart.save();

    res.json({ message: "Trajet supprimé", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* POST pay cart */
router.post("/pay", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.session.userId }).populate("trips");

    if (!cart || cart.trips.length === 0) {
      return res.status(400).json({ error: "Panier vide" });
    }

    // Créer les réservations
    const bookings = cart.trips.map(trip => ({
      userId: req.session.userId,
      tripId: trip._id,
      date: moment().toDate(),
    }));

    await Booking.insertMany(bookings);

    // Vider le panier
    cart.trips = [];
    cart.total = 0;
    cart.isBooking = true;
    await cart.save();

    res.json({ message: "Paiement effectué", redirect: "/bookings" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;




/* GET carts listing. 
router.get("/", (req, res) => {
    res.json({  });
  });

  module.exports = router;*/