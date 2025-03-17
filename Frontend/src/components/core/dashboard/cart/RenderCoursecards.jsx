import React from "react";
import { useDispatch, useSelector } from "react-redux";
import RatingStars from "../../../common/RatingStars";
import { FaBookOpenReader } from "react-icons/fa6";
import { MdAccessTime, MdOutlineDelete } from "react-icons/md";
import calculateTotalCourseDuration from "../../../../utils/calculateTotalCourseDuration";
import { removeFromCart, resetCart } from "../../../../slices/cartSlice";


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

  const handleRemove = (course) => {
    dispatch(removeFromCart(course._id));
    console.log("clicked");
  };

  

  return (
    <div className=" flex flex-col gap-4 ">
      {cart.map((course) => {
        return (
          <div className=" bg-richblack-800 flex gap-3 p-2 justify-between  rounded-lg ">
            <div className=" flex flex-row gap-4 items-center ">
              <div className="w-[250px] min-w-[250px]">
                <img
                  src={course?.thumbnail}
                  alt={course?.courseName}
                  className="h-[150px] rounded-md object-cover w-full"
                />
              </div>
              <div className=" text-white max-w-[55%] flex flex-col gap-1 ">
                <p className=" text-2xl font-semibold">
                  {" "}
                  {course?.courseName}{" "}
                </p>
                <p className=" text-richblack-500 text-sm  ">
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
                <div className="flex flex-row  gap-3">
                  <div className="flex flex-row items-center gap-2">
                    <FaBookOpenReader />
                    <p>
                      <span>{findTotalSubSection(course)} Lectures</span>
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <MdAccessTime />
                    <p>
                      <span>
                        {calculateTotalCourseDuration(course)} Duration
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex flex-col gap-3 items-center justify-center mr-3 ">
              <button
                onClick={() => {
                  handleRemove(course);
                }}
                className=" text-pink-400 font-bold flex flex-row items-center text-xl bg-richblack-600 p-2 rounded-xl hover:bg-richblack-700"
              >
                {" "}
                <MdOutlineDelete />
                <p>Remove </p>{" "}
              </button>
              <p className=" text-yellow-100 text-2xl "> Rs {course?.price} </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderCoursecards;
