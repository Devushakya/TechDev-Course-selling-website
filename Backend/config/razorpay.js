const Razorpay = require("razorpay");
require("dotenv").config;

exports.instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY,
  key_secret: process.env.RAZOR_PAY_SECRET,
});
