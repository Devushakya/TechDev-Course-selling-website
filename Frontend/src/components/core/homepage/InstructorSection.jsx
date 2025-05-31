import React from "react";
import CBAButton from "./CBAButton";
import { FaArrowRight } from "react-icons/fa";
import Instructor from "../../../assets/Images/4905784.jpg"
import HighlightText from "./HighlightText";

const InstructorSection = () => {
  return (
    <div >
      <div className="flex flex-col lg:flex-row gap-20 items-center">
        <div className="lg:w-[50%] flex justify-center">
          <img
            src={Instructor}
            alt=""
            className=" shadow-richblack-600 shadow-[-20px_-20px_0_0] m-14 w-[70%] mx-32"
          />
        </div>
        <div className="lg:w-[50%] flex   gap-10 flex-col">
          <h1 className=" text-4xl  font-semibold text-white text-center lg:text-left ">
            Become an
            <HighlightText text={" instructor"} />
          </h1>

          <p className="font-medium text-[16px] text-center w-[100%] lg:w-[70%] lg:text-left text-richblack-300">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </p>

          <div className=" lg:w-fit flex justify-center">
            <CBAButton active={true} linkto={"/signup"}>
              <div className="flex items-center gap-3">
                Start Teaching Today
                <FaArrowRight />
              </div>
            </CBAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
