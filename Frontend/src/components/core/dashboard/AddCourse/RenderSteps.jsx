import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import CourseBuilder1 from "./CourseBuildersPages/CourseBuilder1";
import CourseBuilder2 from "./CourseBuildersPages/CourseBuilder2";
import CourseBuilder3 from "./CourseBuildersPages/CourseBuilder3";

const RenderSteps = () => {
  const { step } = useSelector((state) => state.course);
  const [refresh, setRefresh] = useState(false);
  const steps = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish" },
  ];

  return (
    <div>
      <div className="flex flex-row justify-center items-center gap-4 mr-20">
        {steps.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-row items-center justify-center gap-2"
          >
            <div className="flex flex-col items-center justify-center">
              {/* Circle */}
              <div
                className={`${
                  step >= item.id
                    ? "bg-yellow-900 border-yellow-50 text-yellow-50"
                    : "border-richblack-700 bg-richblack-800 text-richblack-300"
                } rounded-full border flex items-center justify-center aspect-square w-12`}
              >
                {step > item.id ? <FaCheck className="w-6 h-6" /> : item.id}
              </div>
              {/* Text */}
              <div className="text-white flex flex-row mt-2">
                <p>{item.title}</p>
              </div>
            </div>

            {/* Dashed Border Line */}
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 border-dashed border-b-2 mb-9 ${
                  step > item.id ? "border-yellow-50" : "border-richblack-500"
                }`}
                style={{ height: 0, minWidth: "100px" }}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Form Data */}
      <div className="pt-5">
        {step === 1 && (
          <CourseBuilder1 refresh={refresh} setRefresh={setRefresh} />
        )}
        {step === 2 && (
          <CourseBuilder2 refresh={refresh} setRefresh={setRefresh} />
        )}
        {step === 3 && <CourseBuilder3 />}
      </div>
    </div>
  );
};

export default RenderSteps;
