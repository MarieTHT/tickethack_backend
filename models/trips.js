// BACK END/models/trip.js
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  price: Number
});

module.exports = mongoose.model('Trip', tripSchema);

// schéma à été rajouté 