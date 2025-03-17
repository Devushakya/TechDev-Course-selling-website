import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../../services/operations/profileAPI";
import { IoSearchSharp } from "react-icons/io5";
import CourseCard from "./CourseCard";
import bgimage  from "../../../../assets/Images/2810773.webp"

const EnrolledCourse = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [enrolledCourse, setEnrolledCourse] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [courseProgress, setcourseProgress] = useState([]);
  const [loading, setloading] = useState(false);
  const [searchvalue, setsearchvalue] = useState("");

  useEffect(() => {
    const getCourse = async () => {
      try {
        setloading(true);
        const response = await getUserEnrolledCourses(token);
        console.log("responce", response);
        setEnrolledCourse(response?.course);
        setcourseProgress(response?.courseProgress);
      } catch (error) {
        console.log("Error while get course", error);
      }
      setloading(false);
    };
    getCourse();
  }, []);

  useEffect(() => {
    console.log("searched value", searchvalue);
    const searchCourses = () => {
      if (searchvalue.trim() === "") {
        setFilteredCourses(enrolledCourse);
      } else {
        const filtered = enrolledCourse.filter((course) =>
          course?.courseName?.toLowerCase().includes(searchvalue.toLowerCase())
        );
        setFilteredCourses(filtered);
        console.log("filtered course", filteredCourses);
        console.log("Enrolled course", enrolledCourse);
      }
    };

    searchCourses();
  }, [searchvalue, enrolledCourse]);

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center h-screen   w-full">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="  w-11/12 flex flex-col gap-3 ">
        <p className=" text-white font-semibold text-3xl ">
          My Enrolled Courses
        </p>
      </div>
      {enrolledCourse?.length > 0 ? (
        <div>
          <form className=" mt-7 flex flex-row items-center border-gray-300  gap-2  ">
            <div className="text-white ">
              {" "}
              <IoSearchSharp size={20} />{" "}
            </div>
            <input
              value={searchvalue}
              onChange={(input) => {
                setsearchvalue(input.target.value);
              }}
              placeholder="Search Course"
              className=" p-1  text-white rounded-lg border bg-richblack-600"
              type="text"
            ></input>
          </form>
          <div className=" text-white mt-10 ">
            {" "}
            {searchvalue === "" ? (
              <div className=" flex flex-col gap-7">
                {enrolledCourse?.map((course) => {
                  return (
                    <CourseCard
                      courseProgress={courseProgress}
                      key={course?._id}
                      course={course}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-7">
                {filteredCourses?.map((course) => {
                  return (
                    <CourseCard
                      courseProgress={courseProgress}
                      key={course?._id}
                      course={course}
                    />
                  );
                })}
              </div>
            )}{" "}
          </div>
        </div>
      ) : (
        <div className=" flex flex-col items-center w-full justify-center mt-7">
          <p className=" text-white text-2xl font-bold  ">
            {" "}
            No Course Found For You{" "}
          </p>
          <img height={500} width={500} src={bgimage}></img>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourse;
