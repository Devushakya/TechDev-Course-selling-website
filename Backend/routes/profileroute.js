const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/middlewares");

const {
  updateProfile,
  deleteAccount,
  getAllUserDetails,
  updateDisplayPicture,
  instructorDashboard,
} = require("../controllers/profile");

const {
  resetPasswordToken,
  resetpassword,
} = require("../controllers/resetpassword");

router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteAccount", auth, deleteAccount);
router.get("/getAllUserDetails", auth, getAllUserDetails);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetpassword);

module.exports = router;
