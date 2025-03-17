const randrModel = require("../models/RatingAndReview");
const userModel = require("../models/User");
const courseModel = require("../models/Course");
const { default: mongoose } = require("mongoose");

//createrating


exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure this is set correctly
    const { rating, review, courseId } = req.body;

    console.log("User ID:", userId);
    console.log("Course ID:", courseId);

    // Ensure courseId is treated as an ObjectId
    const courseDetail = await courseModel.findOne({
      _id:new mongoose.Types.ObjectId(courseId), // Use new instance of ObjectId
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetail) {
      console.log("Course not found or user not enrolled.");
      return res.status(401).json({
        status: false,
        message: "Invalid course or user not enrolled",
      });
    }

    const alreadyReview = await randrModel.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReview) {
      return res.status(401).json({
        status: false,
        message: "User already reviewed",
      });
    }

    // Creating rating and review
    const newRatingReview = await randrModel.create({
      user: userId,
      rating: rating,
      review: review,
      course: courseId,
    });

    // Updating course with the new rating
    const updatedCourse = await courseModel.findByIdAndUpdate(
      { _id:new mongoose.Types.ObjectId(courseId) }, // Use new instance of ObjectId here too
      {
        $push: { ratingAndReview: newRatingReview._id },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Rating created successfully",
      newRatingReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      mes: "Error while creating review",
    });
  }
};



//get average rating
exports.getAvgRating = async (req, res) => {
  try {
    const { courseId } = req.body;
    //aggergate matlab kuch steps karne hai
    const result = await randrModel.aggregate([
      {
        $match: { course: new mongoose.Types.ObjectId(courseId) },
        //esa course do jiski id course id ho
      },
      {
        $group: {
          _id: null,
          //kis basis par group karna chate ho ab humne null kar
          //diya matlab jo bhi step 1 se data aa rha hai sabko group kar do
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }
    //matlab koi result nhi bna hai
    return res.status(200).json({
      success: true,
      averageRating: 0,
      message: "No rating given till now",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      mes: "error while creating avg review",
    });
  }
};

exports.getallRating = async (req, res) => {
  try {
    const allreview = await randrModel
      .find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName image email",
        //matlab user ko populate kro par sirf usko first,last name email and image he lao
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "all rating fetched successfully",
      allreview
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      mes: "error while fetching all review review",
    });
  }
};
