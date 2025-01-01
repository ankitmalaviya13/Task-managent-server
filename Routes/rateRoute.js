const express = require("express");
const router = express.Router();
const { getRates, addRate } = require("../Controllers/rateController");
const { protect } = require("../Middlewares/auth");

 //get rates
router.get("/", getRates);

 //add rate
router.post("/",protect, addRate);

module.exports = router;
