import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import { useParams } from "react-router-dom";
import { fetchCourseDetails } from "../../../../services/operations/courseDetailsAPI";
import RenderSteps from "../AddCourse/RenderSteps";

const EditCourse = () => {
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const [loading, setloading] = useState(false);
  const { courseId: realcourseid } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const getccourse = async () => {
      const result = await fetchCourseDetails(realcourseid);
      //   console.log("result aa gya uallla", result?.data);
      dispatch(setEditCourse(true));
      dispatch(setCourse(result?.data));
    };
    getccourse();
  }, [realcourseid]);

  return (
    <div>
      {loading ? (
        <div className="flex flex-row items-center justify-center h-screen overflow-hidden w-full">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          <p className=" text-3xl font-medium text-richblack-5">Edit Course</p>
          {course ? (
            <RenderSteps></RenderSteps>
          ) : (
            <div className=" w-full  h-full text-white flex items-center justify-center">
              {" "}
              <p className=" font-semibold text-3xl"> No Course found to Edit </p>{" "}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditCourse;
