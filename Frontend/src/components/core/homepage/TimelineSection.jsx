import React from "react";
import TimeLineImage from "../../../assets/Images/coding.jpg";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";

const TimeLine = [
  {
    Logo: Logo1,
    Heading: "Strong Leadership",
    Description: "Dedicated to driving success at every level",
  },
  {
    Logo: Logo2,
    Heading: "Commitment",
    Description: "Our learners are always at the heart of what we do",
  },
  {
    Logo: Logo3,
    Heading: "Adaptability",
    Description: "Flexibility is the key to growth and learning",
  },
  {
    Logo: Logo4,
    Heading: "Problem Solving",
    Description: "Learn to code and overcome real-world challenges",
  },
];

const TimelineSection = () => {
  return (
    <div className=" w-full bg-white pt-20  justify-items-center">
      <div className="flex flex-col lg:flex-row gap-20 pb-20 items-center w-11/12 max-w-maxContent justify-center">
        <div className="lg:w-[45%] flex flex-col gap-14 lg:gap-3">
          {TimeLine.map((ele, i) => {
            return (
              <div className="flex flex-col lg:gap-3" key={i}>
                <div className="flex gap-6" key={i}>
                  <div className="w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]">
                    <img src={ele.Logo} alt="" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[18px]">{ele.Heading}</h2>
                    <p className="text-base">{ele.Description}</p>
                  </div>
                </div>
                <div
                  className={` ${
                    TimeLine.length - 1 === i ? "hidden" : "lg:block"
                  }  h-14 border-dotted border-r-4 border-richblack-100 bg-richblack-400/0 w-[26px]`}
                ></div>
              </div>
            );
          })}
        </div>
        <div className="relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]">
          <img
            src={TimeLineImage}
            alt="timelineImage"
            className="shadow-richblack-600 z-1 shadow-[20px_20px_0px_0px] scale-105  object-cover h-[400px] "
          />
          <div className="absolute z-0  translate-x-[35%] lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[80%] bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10 ">
            {/* Section 1 */}
            <div className="flex gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14">
              <h1 className="text-3xl font-bold w-[75px]">10</h1>
              <h1 className="text-caribbeangreen-300 text-sm w-[75px]">
                Years of experience
              </h1>
            </div>

            {/* Section 2 */}
            <div className="flex gap-5 items-center lg:px-14 px-7">
              <h1 className="text-3xl font-bold w-[75px]">250</h1>
              <h1 className="text-caribbeangreen-300 text-sm w-[75px]">
                Course options available
              </h1>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
