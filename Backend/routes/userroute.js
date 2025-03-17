const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/middlewares");

const {
  sendOTP,
  signup,
  login,
  changePassword,
} = require("../controllers/auth");

const { contactUs } = require("../controllers/contactUs");

router.post("/sendOTP", sendOTP);
router.post("/signup", signup);
router.post("/login", login);
router.put("/changePassword",auth ,changePassword);

router.post("/contactUs", contactUs);


module.exports= router;