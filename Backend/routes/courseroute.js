const express = require("express");
const router = express.Router();

//course me se
const {
  createCourse,
  showAllCourse,
  getCourseDetail,
  editCourse,
  deleteCourse,
  getFullCourseDetails,
  getInstructorCourses,
  getEnrolledCourses,
  changeState,
} = require("../controllers/course");

//category me se
const {
  createCategory,
  showallCategorys,
  categoryPageDetails,
} = require("../controllers/category");

//section me se
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/section");

//sub section me se
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/subSection");

//rating and review
const {
  createRating,
  getAvgRating,
  getallRating,
} = require("../controllers/ratingandReview");
const {
  auth,
  isStudent,
  isAdmin,
  isInstructor,
} = require("../middlewares/middlewares");

router.post("/createCourse", auth, isInstructor, createCourse);
router.get("/showAllCourse", showAllCourse);
router.get("/getCourseDetail", getCourseDetail);
router.post("/editCourse", auth, isInstructor, editCourse);
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);
router.get("/getFullCourseDetails", auth, getFullCourseDetails);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.post("/changeState", auth, isInstructor, changeState);
// router.post 

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showallCategorys", showallCategorys);
router.get("/categoryPageDetails", categoryPageDetails);

router.post("/createSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);

router.post("/createSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAvgRating", getAvgRating);
router.get("/getallRating", getallRating);

module.exports = router;
