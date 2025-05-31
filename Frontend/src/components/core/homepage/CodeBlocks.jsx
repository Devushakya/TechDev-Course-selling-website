import React from "react";
import CBAButton from "./CBAButton";
import { FaArrowRight } from "react-icons/fa6";
import { TypeAnimation } from "react-type-animation";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabutton1,
  ctabutton2,
  codeblock,
  backgroundgradient,
  codeColor,
}) => {
  return (
    <div
      className={`flex flex-col ${position} p-3 justify-center my-20 gap-10 md:gap-20`}
    >
      {/* section1 */}
      <div className="flex flex-col gap-6 w-full md:w-[60%] lg:w-[50%] text-center md:text-left mx-auto md:mx-0">
        <div className="text-bold text-white w-full md:w-[80%] mx-auto md:mx-0">
          {heading}
        </div>
        <div className="text-richblack-300 font-bold w-full md:w-[80%] mx-auto md:mx-0">
          {subheading}
        </div>

        {/* Buttons — centered on mobile, row on larger screens */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-7 mt-7 justify-center sm:justify-start mx-auto sm:mx-0">
          <CBAButton active={ctabutton1.active} linkto={ctabutton1.link}>
            <div className="flex gap-2 items-center justify-center">
              {ctabutton1.btnText}
              <FaArrowRight />
            </div>
          </CBAButton>
          <CBAButton active={ctabutton2.active} linkto={ctabutton2.link}>
            <div className="flex gap-2 items-center justify-center">
              {ctabutton2.btnText}
              <FaArrowRight />
            </div>
          </CBAButton>
        </div>
      </div>

      {/* coding section */}
      <div className="relative h-fit w-full sm:w-[90%] md:w-[70%] lg:w-[500px] flex flex-row text-[10px] py-4 lg:py-8 border-richblack-300 border-2 bg-transparent backdrop-blur-md mx-auto md:mx-0">
        <div className="absolute inset-0 flex justify-center items-center -z-10">
          <div className="absolute w-[250px] sm:w-[300px] md:w-[350px] top-4 left-4 h-[80px] sm:h-[100px] bg-gradient-to-r from-[#84fab0] to-[#8fd3f4] blur-3xl rounded-full shadow-[0_0_50px_20px_rgba(59,130,246,0.1)]"></div>
        </div>
        <div className="flex flex-col items-center text-center w-[10%] font-inter font-bold text-richblack-300">
          {Array.from({ length: 20 }, (_, idx) => (
            <p key={idx}>{idx + 1}</p>
          ))}
        </div>
        <div
          className={`font-bold w-[90%] font-mono flex flex-col gap-2 pr-2 ${codeColor}`}
        >
          <TypeAnimation
            sequence={[codeblock, 5000, ""]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={true}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
