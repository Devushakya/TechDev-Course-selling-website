const Usermodel = require("../models/User");
const categoryModel = require("../models/Category");
const courseModel = require("../models/Course");
const sectionModel = require("../models/Section");
const subsectionModel = require("../models/SubSection");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");

require("dotenv").config();

//create course handler
exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body;

    // Get thumbnail image from request files
    const thumbnail = req.files?.thumbnailImage;

    // Validate and parse `tag` and `instructions`
    let tag, instructions;
    try {
      tag = _tag ? JSON.parse(_tag) : [];
      instructions = _instructions ? JSON.parse(_instructions) : [];
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid format for tag or instructions. Must be valid JSON.",
      });
    }

    console.log("Parsed tag:", tag);
    console.log("Parsed instructions:", instructions);

    // Check if any required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !thumbnail ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory, and arrays must not be empty.",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }

    // Check if the user is an instructor
    const instructorDetails = await Usermodel.findById(userId);
    if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found or invalid account type.",
      });
    }

    // Check if the category exists
    const categoryDetails = await categoryModel.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found.",
      });
    }

    // Upload the thumbnail to Cloudinary
    const thumbnailImage = await uploadToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    if (!thumbnailImage || !thumbnailImage.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload thumbnail image.",
      });
    }

    // Create a new course with the given details
    const newCourse = await courseModel.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status,
      instructions,
    });

    // Add the new course to the instructor's courses
    await Usermodel.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Add the new course to the category
    await categoryModel.findByIdAndUpdate(
      category,
      { $push: { course: newCourse._id } },
      { new: true }
    );

    // Return the new course and success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course created successfully.",
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course.",
      error: error.message,
    });
  }
};

//showing all course
exports.showAllCourse = async (req, res) => {
  try {
    const allCourse = await courseModel.find({}).populate("instructor").exec();
    return res.status(200).json({
      success: true,
      message: "course sended successfully",
      allCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "error while sending course",
    });
  }
};

exports.getCourseDetail = async (req, res) => {
  try {
    const { courseId } = req.query;
    // console.log("koise ki id",courseId)
    const courseDetail = await courseModel
      .findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    if (!courseDetail) {
      return res.status(401).json({
        status: false,
        message: "invalid course",
      });
    }

    return res.status(200).json({
      success: true,
      message: "course sended  successfully",
      data: courseDetail,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "error while getting course data course",
    });
  }
};
// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    console.log("updates aa gye", updates.category);
    console.log("couse ki id", courseId);

    // Find the course by ID
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    console.log("course ki categery", course.category._id);

    // If a thumbnail image is provided, update it
    if (req.files && req.files.thumbnailImage) {
      console.log("Updating thumbnail...");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Check if the category is being updated
    if (updates.category && updates.category !== course.category) {
      // Remove the course from the previous category
      console.log("yaha tak");
      const bekar = await categoryModel.findByIdAndUpdate(
        course.category,
        {
          $pull: { course: courseId },
        },
        { new: true }
      );
      console.log("yaha tak2 bekar", bekar);

      // Add the course to the new category
      const newCategory = await categoryModel.findById(updates.category);
      if (!newCategory) {
        return res.status(404).json({ error: "New category not found" });
      }
      console.log("yaha tak3");
      await categoryModel.findByIdAndUpdate(
        updates.category,
        {
          $push: { course: courseId },
        },
        { new: true }
      );
      console.log("yaha tak4");

      // Update the course's category
      course.category = updates.category;
      console.log("yaha tak7");
    }

    // Update other fields in the course
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else if (key !== "category") {
          course[key] = updates[key];
        }
      }
    }
    console.log("yaha tak8");

    // Save the updated course
    await course.save();

    // Populate the updated course with all necessary details
    const updatedCourse = await courseModel
      .findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await courseModel
      .findOne({
        _id: courseId,
      })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id;

    // Find all courses belonging to the instructor
    const instructorCourses = await courseModel
      .find({
        instructor: instructorId,
      })
      .sort({ createdAt: -1 })
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      });

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await Usermodel.findByIdAndUpdate(studentId, {
        $pull: { course: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await sectionModel.findById(sectionId);
      if (section) {
        const subSections = section.SubSection;
        for (const subSectionId of subSections) {
          await subsectionModel.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await sectionModel.findByIdAndDelete(sectionId);
    }

    const category = course.category;
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      category,
      {
        $pull: { course: courseId },
      },
      { new: true }
    );
    // console.log("updated category", updatedCategory);
    if (!updatedCategory) {
      return res.status(500).json({
        success: false,
        message: "Failed to update category. Course ID not removed.",
      });
    }
    // Delete the course
    await courseModel.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await Usermodel.findOne({ _id: userId })
      .populate([
  {
    path: "course",
    populate: [
      { path: "category" }, 
      {
        path: "courseContent",
        populate: { path: "SubSection" },
      },
    ],
  },
  {
    path: "courseProgress",
    populate: [
      { path: "courseID" },
      { path: "completedVideos" },
    ],
  },
])
.exec();


    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.changeState = async (req, res) => {
  try {
    const { courseId, status } = req.body;
    console.log("data is coming baby", courseId, status);

    const findcourse = await courseModel.findById(courseId);
    if (!findcourse) {
      return res.status(404).json({
        success: false,
        message: "course not found to change state",
      });
    }

    const course = await courseModel.findByIdAndUpdate(
      courseId,
      {
        status: status,
      },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "course not updated state",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course status changed successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
