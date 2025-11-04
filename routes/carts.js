var express = require("express");
var router = express.Router();
const moment = require("moment");

const Trip = require("../models/trips");
const Cart = require("../models/carts");
const { checkBody } = require("../modules/checkApi");

/* GET carts listing. */
router.get("/", (req, res) => {
    res.json({  });
  });

  module.exports = router;