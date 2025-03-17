const jwt = require("jsonwebtoken");
require("dotenv").config();
const Usermodel = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    

    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verifying token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("decode", decode);

      // Fetch the user by ID and populate the additionalDetails field
      const user = await Usermodel.findById(decode.id)
        .populate("additionalDetails")
        .exec();
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = user;
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({
        success: false,
        message: "Can't verify token",
      });
    }

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for students only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wront ,Please try again",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wront ,Please try again",
    });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for Instructor only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wront ,Please try again",
    });
  }
};
