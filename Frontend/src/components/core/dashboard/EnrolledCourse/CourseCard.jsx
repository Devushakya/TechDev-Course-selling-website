import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../../../../App.css";
import { FaBookOpenReader } from "react-icons/fa6";
import calculateTotalCourseDuration from "../../../../utils/calculateTotalCourseDuration";
import { MdAccessTime } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, courseProgress }) => {
  const navigate = useNavigate();
  const findTotalSubSection = (course) => {
    if (!course || !course.courseContent) return 0;

    return course.courseContent.reduce(
      (total, section) => total + (section.SubSection?.length || 0),
      0
    );
  };

  const circularProgressValue = (course, courseProgress) => {
    if (!courseProgress || !Array.isArray(courseProgress)) return 0;

    const progressed = courseProgress.find(
      (progress) => progress?.courseID?._id === course?._id
    );

    if (!progressed || !progressed.completedVideos) return 0;

    const completedLength = progressed.completedVideos.length;
    const totalSubSections = findTotalSubSection(course);
    // console.log("check kar raha", completedLength, totalSubSections);

    if (totalSubSections === 0) return 0;

    return (completedLength / totalSubSections) * 100;
  };

  const navigateit = () => {
    navigate(`/view-course/${course?._id}`);
  };

  return (
    <div
      onClick={navigateit}
      className="bg-richblack-700 hover:cursor-pointer rounded-2xl flex flex-col sm:flex-row gap-4 p-2"
    >
      <div className="w-full sm:w-[25%]">
        <img
          src={course?.thumbnail}
          alt={course?.courseName}
          className="rounded-md object-cover w-full aspect-[16/9] sm:aspect-auto"
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="border-2 w-fit py-[2px] px-2 border-richblack-500">
          <p className="text-xs">{course?.category?.name}</p>
        </div>

        <p className="text-xl">{course?.courseName}</p>

        <p className="text-sm text-richblack-400">
          {course?.courseDescription}
        </p>

        <div className="flex flex-row items-center gap-3  ">
          <div className="">
            <CircularProgressbar
              className="h-10 w-fit flex items-center"
              value={circularProgressValue(course, courseProgress)}
              styles={buildStyles({
                pathColor: "#72eb4c",
                trailColor: "#2c2c2c",
                textColor: "#ffffff",
              })}
            />
          </div>

          <p className="w-full text-white">
            {" "}
            <span>{circularProgressValue(course, courseProgress)}</span> %
            Completed
          </p>
        </div>

        <div className="flex flex-row  gap-3">
          <div className="flex flex-row items-center gap-2">
            <FaBookOpenReader />
            <p>
              <span>{findTotalSubSection(course)} Total Lectures</span>
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <MdAccessTime />
            <p>
              <span>{calculateTotalCourseDuration(course)} Total Duration</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
