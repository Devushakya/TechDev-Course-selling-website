import React, { useEffect, useState } from "react";
import { instructorDashboard } from "../../../../services/operations/profileAPI";
import { useSelector } from "react-redux";
import { HiTrendingUp } from "react-icons/hi";
import { TbCoinRupee } from "react-icons/tb";
import bg from "../../../../assets/Images/Untitled design.svg";
import ChartData from "./ChartData";
import { Link } from "react-router-dom";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";

const InstructorMain = () => {
  const [data, setData] = useState(null);
  const [coursedata, setcoursedata] = useState([]);
  const [loading, setloading] = useState(false);
  const { user } = useSelector((state) => state.profile);
  console.log("profile", user);
  const { token } = useSelector((state) => state.auth);
  const visualizeHandle = (data) => {
    setvisualize(data);
  };

  const [visualize, setvisualize] = useState("Students");

  useEffect(() => {
    setloading(true);
    const getdata = async () => {
      const result = await instructorDashboard(token);
      if (result) {
        console.log("result aa gaya", result);
        setData(result);
      }
      setloading(false);
    };
    getdata();
  }, []);

  useEffect(() => {
    const getcoursedata = async () => {
      setloading(true);
      const result = await fetchInstructorCourses(token);
      if (result) {
        console.log("dele bhai", result);
        setcoursedata(result);
      }
      setloading(false);
    };
    getcoursedata();
  }, []);

  console.log("final check", coursedata);

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center h-screen   w-full">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="text-white gap-3 flex flex-col">
        <p className="text-3xl font-semibold text-richblack-5">Dashboard</p>
        <p>
          Hello{" "}
          <span className="text-yellow-100 text-lg">{user.firstName}</span>
        </p>
      </div>

      {coursedata.length > 0 ? (
        <div>
          <div className="flex flex-row w-11/12  gap-6 mt-7">
            {/* Left Section */}
            <div className="flex flex-col justify-center basis-1/2 gap-6  ">
              {/* Earnings Card */}
              <div className="relative w-full rounded-2xl border-2 border-richblack-700 overflow-hidden">
                <img
                  src={bg}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="gap-2 flex flex-col p-4 relative z-10">
                  <p className="text-md text-white">Your Earnings</p>
                  <div className="flex flex-row gap-1 items-center text-4xl text-white">
                    <TbCoinRupee />
                    <p>{data?.TotalEarning}</p>
                  </div>
                  <div className="flex flex-row gap-1 items-center">
                    <div className="text-caribbeangreen-200">
                      <HiTrendingUp />
                    </div>
                    <p className="text-white">15% More than Last week</p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex gap-4">
                <div className="bg-yellow-200 text-black w-1/2 border-2 rounded-2xl border-richblack-700 p-4 flex flex-col gap-2">
                  <p className="text-md font-bold">Total Students Enrolled</p>
                  <p className="text-4xl">{data?.TotalStudents}</p>
                </div>
                <div className="bg-richblack-800 text-white w-1/2 border-2 rounded-2xl border-richblack-700 p-4 flex flex-col gap-2">
                  <p className="text-md">Total Courses</p>
                  <p className="text-4xl">{data?.courses.length}</p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <ChartData
              visualize={visualize}
              visualizeHandle={visualizeHandle}
              courses={data?.courses}
            />
          </div>
          <div className="rounded-md bg-richblack-800 p-6 mt-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-md font-semibold text-yellow-50">View All</p>
              </Link>
            </div>
            <div className="my-4 flex items-start space-x-6">
              {coursedata?.slice(0, 3).map((course) => {
                return (
                  <div key={course?._id} className="w-1/3">
                    <img
                      src={course?.thumbnail}
                      alt={course?.courseName}
                      className="h-[201px] w-full rounded-md object-cover"
                    />
                    <div className="mt-3 w-full">
                      <p className="text-sm font-medium text-richblack-50">
                        {course?.courseName}
                      </p>
                      <div className="mt-1 text-lg flex items-center space-x-2">
                        <p className="text-sm font-medium text-richblack-300">
                          {course?.studentsEnrolled.length} students
                        </p>
                        <p className="text-sm font-medium text-richblack-300">
                          |
                        </p>
                        <p className="text-sm font-medium text-richblack-300">
                          Rs. {course?.price}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default InstructorMain;
