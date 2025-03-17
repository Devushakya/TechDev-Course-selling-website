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
    <div className={`flex ${position} justify-center  my-20 gap-20`}>
      {/* section1 */}
      <div className="flex flex-col gap-8 w-[50%]">
        <div className=" text-bold text-white w-[80%]">{heading}</div>
        <div className=" text-richblack-300 font-bold w-[80%]">
          {subheading}
        </div>
        <div className="flex flex-row gap-7 mt-7">
          <CBAButton active={ctabutton1.active} linkto={ctabutton1.link}>
            <div className="flex gap-2 items-center">
              {ctabutton1.btnText}
              <FaArrowRight />
            </div>
          </CBAButton>
          <CBAButton active={ctabutton2.active} linkto={ctabutton2.link}>
            <div className="flex gap-2 items-center">
              {ctabutton2.btnText}
              <FaArrowRight />
            </div>
          </CBAButton>
        </div>
      </div>

      {/* coding wala section */}
      <div className=" relative h-fit flex flex-row text-10[px] w-[100%] py-4 lg:w-[500px] border-richblack-300 border-2 bg-transparent backdrop-blur-md ">
        <div className="absolute inset-0 flex justify-center items-center -z-10">
          <div className=" absolute w-[350px] top-4 left-4 h-[100px] bg-gradient-to-r from-[#84fab0]  to-[#8fd3f4] blur-3xl rounded-full shadow-[0_0_50px_20px_rgba(59,130,246,0.1)]"></div>
        </div>
        <div className="flex flex-col items-center text-center w-[10%] font-inter font-bold text-richblack-300">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>
        <div
          className={` font-bold w-[90%] font-mono flex flex-col gap-2 pr-2 ${codeColor}`}
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
          ></TypeAnimation>
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
