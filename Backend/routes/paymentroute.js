const express = require("express");
const router = express.Router();

const {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/payment");
const { auth, isStudent } = require("../middlewares/middlewares");

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/vertifyPayment", auth, isStudent, verifyPayment);
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);
module.exports = router;
