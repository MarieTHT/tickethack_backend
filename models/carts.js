const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  total: Number,
  isBooking: Boolean,
  trips:[{type: mongoose.Schema.Types.ObjectId, ref: 'trips'}]

});

const Cart = mongoose.model('carts', cartSchema);

module.exports = Cart;