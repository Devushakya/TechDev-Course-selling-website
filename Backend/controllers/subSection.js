const sectionModel = require("../models/Section");
const subsectionModel = require("../models/SubSection");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");

exports.createSubSection = async (req, res) => {
  try {
    const { title, description, sectionID } = req.body;
    const video = req.files.videoFile;

    if (!title || !description || !sectionID || !video) {
      return res.status(401).json({
        status: false,
        message: "fill all details to create subsection",
      });
    }

    const uploadedVideo = await uploadToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const newsubsection = await subsectionModel.create({
      title: title,
      timeDuration: `${uploadedVideo.duration}`,
      description: description,
      videoUrl: uploadedVideo.secure_url,
    });

    const updatedSection = await sectionModel
      .findByIdAndUpdate(
        { _id: sectionID },
        { $push: { SubSection: newsubsection._id } },
        { new: true }
      )
      .populate({
        path: "SubSection",
      })
      .exec();
    return res.status(200).json({
      success: true,
      message: "subsection created successfully",
      updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "error happened while creating subsection ,Please try again",
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const subSection = await subsectionModel.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    // find updated section and return it
    const updatedSection = await sectionModel
      .findById(sectionId)
      .populate("SubSection");

    console.log("updated section", updatedSection);

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    await sectionModel.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          SubSection: subSectionId,
        },
      }
    );
    const subSection = await subsectionModel.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    // find updated section and return it
    const updatedSection = await sectionModel
      .findById(sectionId)
      .populate("SubSection");

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection", 
    });
  }
};
