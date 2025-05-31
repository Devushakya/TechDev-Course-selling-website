const categoryModel = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(401).json({
        status: false,
        message: "fill all details to create category",
      });
    }

    const createdCategory = await categoryModel.create({
      name: name,
      description: description,
    });
    console.log(createdCategory);
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "error while creating Category",
    });
  }
};

exports.showallCategorys = async (req, res) => {
  try {
    const allCategorys = await categoryModel.find(
      {},
      { name: true, description: true }
    );
    // console.log(allCategorys);
    return res.status(200).json({
      success: true,
      message: "all Category returned successfully",
      allCategorys,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "error while sending Category",
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryName } = req.query;
    console.log("category ka naam", categoryName);
    const categoryID = await categoryModel.findOne({ name: categoryName });
    console.log("kya ye sech hai", categoryID);

    const selectedCategory = await categoryModel
      .findById(categoryID)
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: {
          path: "instructor",
          path: "ratingAndReview",
        },
      })
      .exec();

    console.log("selected courses", selectedCategory);

    if (!selectedCategory) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    if (selectedCategory.course.length === 0) {
      return res.status(404).json({
        status: false,
        message: "no course found in category",
      });
    }

    const sortedCourses = [...selectedCategory.course].sort(
      (a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length
    );

    console.log("sorted course", sortedCourses);

    const differentCategory = await categoryModel
      .find({ _id: { $ne: categoryID } }) //ne= not equal kyuki me different nikal rha
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: {
          path: "instructor",
          path: "ratingAndReview",
        },
      });
    let differentcourse = [];
    for (const category of differentCategory) {
      differentcourse.push(...category.course);
    }

    //getting top selling courses
    const allCategorys = await categoryModel
      .find({})
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: {
          path: "instructor",
          path: "ratingAndReview",
        },
      })
      .exec();

    const allCourses = allCategorys.flatMap((category) => category.course);

    // console.log(allCourses);

    const mostsellingCourse = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
    //slice sirf top 10 he dega

    return res.status(200).json({
      success: true,
      message: "all Category page detail successfully",
      selectedCategory: selectedCategory,
      differentcourse: differentcourse,
      mostsellingCourse: mostsellingCourse,
      sortedCourses: sortedCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "error while sending Categoryall page detail",
    });
  }
};
