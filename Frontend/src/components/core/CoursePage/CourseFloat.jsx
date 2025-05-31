import React from "react";
import { GrShareOption } from "react-icons/gr";
import { MdArrowRight } from "react-icons/md";
import toast from "react-hot-toast";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";

const CourseFloat = ({ course, buyCoursehandler }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isCourseInCart = cart.some((item) => item?._id === course?._id);

  const HandleShare = () => {
    toast.success("Copied to clipboard");
  };

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.");
      return;
    }
    if (token) {
      dispatch(addToCart(course));
    }
  };

  return (
    <div
      className="
      bg-richblack-600 rounded-md p-4 shadow-lg flex flex-col space-y-4
      w-full max-w-md
      mx-auto
      lg:absolute lg:right-10 lg:top-[50%] lg:mx-0 lg:w-[300px]
    "
    >
      <div className="items-center">
        <div>
          <img
            src={course?.thumbnail}
            alt={course?.courseName}
            className="max-h-[200px] min-h-[180px] w-full overflow-hidden rounded-2xl object-cover md:max-w-full"
          />
        </div>

        <div className="w-full flex flex-col items-center space-y-3">
          <p className="pt-2 text-lg font-semibold text-white">{`Rs ${course?.price}`}</p>

          <div className="flex flex-col gap-2 w-full space-y-2">
            <button
              className="w-full rounded-md py-2 bg-yellow-50 text-black font-bold hover:bg-yellow-100 hover:scale-105 transition-all"
              onClick={
                user && course?.studentsEnrolled.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : buyCoursehandler
              }
            >
              {user && course?.studentsEnrolled.includes(user?._id)
                ? "Go To Course"
                : "Buy Now"}
            </button>

            {user && !course?.studentsEnrolled.includes(user?._id) && (
              <button
                onClick={isCourseInCart ? undefined : handleAddToCart}
                className={`w-full rounded-md py-2 font-bold  transition-all ${
                  isCourseInCart
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-richblack-500 text-white hover:bg-richblack-400 hover:scale-105 "
                }`}
              >
                {isCourseInCart ? "Added to Cart" : "Add To Cart"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-2">
          <p className="text-white text-md">This course will Contain:</p>
          {course?.instructions.map((value, key) => (
            <div
              key={key}
              className="text-sm text-yellow-100 flex flex-row items-center"
            >
              <MdArrowRight />
              <p>{value}</p>
            </div>
          ))}
        </div>

        <CopyToClipboard text={window.location.href} onCopy={HandleShare}>
          <button className="mt-3 share-button flex flex-row text-yellow-100 items-center gap-1 justify-center w-full text-lg">
            <GrShareOption />
            <span>Share</span>
          </button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default CourseFloat;
