const profileModel = require("../models/Profile");
const userModel = require("../models/User");
const courseModel = require("../models/Course");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");

exports.updateProfile = async (req, res) => {
  try {
    const { gender, dateOfBirth, about, contactNumber, firstName, lastName } =
      req.body;
    const userId = req.user.id;

    // Fetch user data to get the profile ID
    const userData = await userModel.findById(userId);
    const profileID = userData.additionalDetails;

    // Prepare updates for the profile model
    const updatedProfileFields = {};
    if (gender) updatedProfileFields.gender = gender;
    if (dateOfBirth) updatedProfileFields.dateOfBirth = dateOfBirth;
    if (about) updatedProfileFields.about = about;
    if (contactNumber) updatedProfileFields.contactNumber = contactNumber;

    // Prepare updates for the user model
    const updatedUserFields = {};
    if (firstName) updatedUserFields.firstName = firstName;
    if (lastName) updatedUserFields.lastName = lastName;

    // Update the profile model
    if (Object.keys(updatedProfileFields).length > 0) {
      await profileModel.findByIdAndUpdate(
        profileID,
        { $set: updatedProfileFields },
        { new: true }
      );
    }

    // Update the user model
    if (Object.keys(updatedUserFields).length > 0) {
      await userModel.findByIdAndUpdate(
        userId,
        { $set: updatedUserFields },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the profile. Please try again.",
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    const userdetail = await userModel.findById(id);

    if (!userdetail) {
      return res.status(401).json({
        status: false,
        message: "User is not there to delete",
      });
    }

    //agar user delete kroge to uski profile bhi to delete karni padegi na
    await profileModel.findByIdAndDelete({
      _id: userdetail.additionalDetails,
    });
    //unenrolling user for enrolled courses
    const userCourses = userdetail.course;

    //removing user from their courses
    await courseModel.updateMany(
      { _id: { $in: userCourses } },
      { $pull: { studentsEnrolled: id } }
    );
    //yaha $in bas match karta hai matlab  vahi dudh ke layega jinka id usercourses me hai

    //deleting user
    await userModel.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "error happened while Deleting profile ,Please try again",
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetail = await userModel
      .findById(id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "User all data given successfully",
      userDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "error happened while getting user data ,Please try again",
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    
    console.log(image);
    const updatedProfile = await userModel.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();
    userDetails = userDetails.toObject();
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await courseModel.find({ instructor: req.user.id });
    var fullStudent = 0;
    var fullearning = 0;

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      fullStudent += totalStudentsEnrolled;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;
      fullearning += totalAmountGenerated;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    res.status(200).json({
      courses: courseData,
      TotalStudents: fullStudent,
      TotalEarning: fullearning,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
