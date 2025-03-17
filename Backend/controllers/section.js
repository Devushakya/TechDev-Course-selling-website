const sectionModel = require("../models/Section");
const subsectionModel = require("../models/SubSection");
const courseModel = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    const { sectionName: sectionName, courseID: courseID } = req.body;

    if (!sectionName || !courseID) {
      return res.status(401).json({
        status: false,
        message: "fill all details to create section",
      });
    }
    const courseIdStr = String(courseID);
    //creating section
    const newSection = await sectionModel.create({ sectionName: sectionName });

    //updating course
    const newCourse = await courseModel
      .findByIdAndUpdate(
        courseID,
        { $push: { courseContent: newSection._id } },
        { new: true }
      )
      .populate({
        path: "courseContent", // First populate 'courseContent' (sections)
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    if (!newCourse) {
      return res.status(401).json({
        success: false,
        messsage: "Dont get ansy course",
      });
    }
    console.log("new course of create section", newCourse);

    return res.status(200).json({
      success: true,
      message: "Course section created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "error happened while creating section ,Please try again",
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionID, courseId } = req.body;

    // Validate required fields
    if (!sectionName || !sectionID) {
      return res.status(401).json({
        status: false,
        message: "Provide section name and section ID to update.",
      });
    }

    const updatedSection = await sectionModel.findByIdAndUpdate(
      sectionID,
      { sectionName },
      { new: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found.",
      });
    }

    const course = await courseModel
      .findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section updated successfully.",
      data: course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the section. Please try again.",
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;
    await courseModel.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId, 
      },
    });
    const section = await sectionModel.findById(sectionId);
    console.log(sectionId, courseId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not Found",
      });
    }

    //delete sub section
    await subsectionModel.deleteMany({ _id: { $in: section.SubSection } });

    await sectionModel.findByIdAndDelete(sectionId);

    //find the updated course and return
    const course = await courseModel
      .findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
