import React from "react";
import { useDispatch, useSelector } from "react-redux";
import RatingStars from "../../../common/RatingStars";
import { FaBookOpenReader } from "react-icons/fa6";
import { MdAccessTime, MdOutlineDelete } from "react-icons/md";
import calculateTotalCourseDuration from "../../../../utils/calculateTotalCourseDuration";
import { removeFromCart } from "../../../../slices/cartSlice";

const RenderCoursecards = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const findTotalSubSection = (course) => {
    if (!course || !course.courseContent) return 0;
    return course.courseContent.reduce(
      (total, section) => total + (section.SubSection?.length || 0),
      0
    );
  };

  const handleRemove = (courseId) => {
    dispatch(removeFromCart(courseId));
  };

  return (
    <div className="flex flex-col gap-4">
      {cart.map((course) => (
        <div
          key={course._id}
          className="bg-richblack-800 flex flex-col md:flex-row gap-4 p-4 rounded-lg"
        >
          {/* Thumbnail - full width on mobile */}
          <div className="w-full md:w-[250px] min-w-[250px]">
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className="h-[150px] w-full rounded-md object-cover"
            />
          </div>

          {/* Course info and buttons container */}
          <div className="flex flex-col justify-between w-full">
            {/* Course info */}
            <div className="text-white flex flex-col gap-2">
              <p className="text-2xl font-semibold">{course?.courseName}</p>
              <p className="text-richblack-500 text-sm">
                {course?.courseDescription
                  ? course.courseDescription.split(" ").length > 25
                    ? course.courseDescription
                        .split(" ")
                        .slice(0, 25)
                        .join(" ") + "..."
                    : course.courseDescription
                  : ""}
              </p>
              <RatingStars Review_Count={course?.ratingAndReviews} />
              <div className="flex flex-row gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <FaBookOpenReader />
                  <span>{findTotalSubSection(course)} Lectures</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdAccessTime />
                  <span>{calculateTotalCourseDuration(course)} Duration</span>
                </div>
              </div>
            </div>

            {/* Remove button and price */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-4 md:mt-0 gap-4 md:gap-8">
              <button
                onClick={() => handleRemove(course._id)}
                className="text-pink-400 font-bold flex items-center text-xl bg-richblack-600 p-2 rounded-xl hover:bg-richblack-700 cursor-pointer"
                aria-label={`Remove ${course.courseName} from cart`}
              >
                <MdOutlineDelete />
                <span className="ml-2">Remove</span>
              </button>
              <p className="text-yellow-100 text-2xl font-semibold">
                Rs {course?.price}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderCoursecards;
