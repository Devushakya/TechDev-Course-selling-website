import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import bg from "../assets/Images/downloadCourseToSee.png";
import VideoViewer from "../components/core/ViewCoursePage/MainViewCourse";

const ViewCourse = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const navigateToBuy = () => {
    navigate(`/courses/${courseId}`);
  };

  const courseExists = user.course.some((course) => course === courseId);

  return (
    <div className="">
      {!courseExists ? (
        <div className=" text-white flex flex-col items-center ">
          <p className=" text-3xl font-bold mt-9">
            Buy this course to see it's Lectures
          </p>
          <button
            onClick={navigateToBuy}
            className=" mt-5 bg-yellow-100 text-black font-bold items-center rounded-lg  p-2"
          >
            {" "}
            Buy Now{" "}
          </button>
          <div>
            {" "}
            <img height={500} width={500} src={bg}></img>{" "}
          </div>
        </div>
      ) : (
        <div>
          <VideoViewer courseId={courseId} />
        </div>
      )}
    </div>
  );
};

export default ViewCourse;
