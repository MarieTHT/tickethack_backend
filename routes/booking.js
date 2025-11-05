var express = require("express");
var router = express.Router();

const Cart = require("../models/carts");
const Booking = require("../models/bookings");

// 🔹 GET /bookings → affiche toutes les réservations
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 POST /bookings/pay → simule le paiement du panier
router.post("/pay", async (req, res) => {
  try {
    // etape 1: On récupère le panier (ici, on suppose qu’il n’y en a qu’un)
    const cart = await Cart.findOne();

    if (!cart || cart.trips.length === 0) {
      return res.status(400).json({ error: "Panier vide" });
    }

    // etape 2: Pour chaque trajet du panier, on crée une réservation
    const newBookings = cart.trips.map((trip) => ({
      departure: trip.departure,
      arrival: trip.arrival,
      date: trip.date,
      price: trip.price,
    }));

    await Booking.insertMany(newBookings);

    // etape 3: On vide le panier après paiement
    cart.trips = [];
    cart.total = 0;
    await cart.save();

    res.json({ message: "Paiement effectué avec succès", bookings: newBookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 DELETE /bookings → vide toutes les réservations
router.delete("/", async (req, res) => {
  try {
    await Booking.deleteMany({});
    res.json({ message: "Toutes les réservations ont été supprimées." });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
