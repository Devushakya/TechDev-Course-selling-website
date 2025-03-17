import React, { useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CourseTable from "./CourseTable";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";

const MycourseMain = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getcourses = async () => {
      const result = await fetchInstructorCourses(token);
      if (result) {
        console.log("result aa gya", result);
        setCourse(result);
      }
    };

    setLoading(false);

    getcourses();
  }, []);

  return (
    <div>
      <div className="flex flex-row items-center justify-between ">
        <div>
          <p className=" text-3xl font-medium text-richblack-5">My Courses</p>
        </div>
        <div>
          <button
            className=" flex
          flexrow  bg-yellow-50 p-2  items-center cursor-pointer gap-2 rounded-md  font-semibold text-richblack-900"
            onClick={() => {
              navigate("/dashboard/add-course");
            }}
          >
            <IoIosAdd size={25} />
            <p>Add Course</p>
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex flex-row items-center justify-center h-screen   w-full">
          <div className="loader"></div>
        </div>
      ) : (
        <div className=" mt-5">
          <CourseTable course={course} setCourse={setCourse} />
        </div>
      )}
    </div>
  );
};

export default MycourseMain;
