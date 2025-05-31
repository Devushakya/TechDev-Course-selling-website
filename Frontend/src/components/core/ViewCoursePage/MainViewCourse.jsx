import React, { useEffect, useState } from "react";
import {
  confirmRating,
  createRating,
  fetchCourseDetails,
  markLectureAsComplete,
} from "../../../services/operations/courseDetailsAPI";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import { PiVideoFill } from "react-icons/pi";
import { MdQuiz } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoStar } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const MainViewCourse = ({ courseId }) => {
  const [loading, setLoading] = useState(false);
  const [isuserReviewed, setisuserReviewed] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [courseProgress, setcourseProgress] = useState(null);
  const [course, setCourse] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const naviagte = useNavigate();

  const { token } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) {
      alert("Please select a rating.");
      return;
    }
    onSubmit({ rating, reviewText });
    setRating(0);
    setReviewText("");
  };

  const onSubmit = async (data) => {
    const finalData = {
      rating: data.rating,
      review: data.reviewText,
      courseId: courseId,
    };
    // console.log("data aa rha", finalData);
    await createRating(finalData, token);
    setisuserReviewed(true);
  };

  useEffect(() => {
    const getratingdata = async () => {
      setLoading3(true);
      console.log("course ki id", courseId);
      const ci = JSON.stringify(courseId);
      // console.log("ci ki value",ci);
      const responce = await confirmRating(ci, token);
      const message = responce?.data.message;
      if (message == "YES") {
        setisuserReviewed(true);
      }
      setLoading3(false);
    };
    getratingdata();
  }, []);

  useEffect(() => {
    const getfullDetail = async () => {
      setLoading(true);
      const result = await fetchCourseDetails(courseId, token);
      if (result) {
        setCourse(result.data);
      }
      setLoading(false);
    };
    getfullDetail();
  }, []);

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading2(true);
        const response = await getUserEnrolledCourses(token);
        console.log("responce", response.courseProgress);
        const progresses = response.courseProgress.filter(
          (pro) => pro.courseID._id === courseId
        );

        //   console.log("kya ye wahi hai",progresses[0]);

        setcourseProgress(progresses.length > 0 ? progresses[0] : null);
        console.log("course progress", courseProgress);
      } catch (error) {
        console.log("Error while get course", error);
      }
      setLoading2(false);
    };
    getCourse();
  }, []);

  const findTotalSubSection = (course) => {
    if (!course || !course.courseContent) return 0;

    return course.courseContent.reduce(
      (total, section) => total + (section.SubSection?.length || 0),
      0
    );
  };

  const findbarLength = () => {
    const totalSubSection = findTotalSubSection(course);
    const coveredSubsection = courseProgress?.completedVideos.length;
    if (coveredSubsection == 0) return 0;
    else return (coveredSubsection / totalSubSection) * 100;
  };

  const navigateToVideo = async (secId, secdata) => {
    // console.log("me to nhi hu", secdata);
    const data = {
      courseId: courseId,
      subsecId: secId,
    };
    const responce = await markLectureAsComplete(data, token);
    console.log("mark lecture ka", responce);
    if (responce)
      naviagte(`/view-course/video/${secId}`, { state: { secdata: secdata } });
  };

  return (
    <div>
      {loading || loading2 || loading3 ? (
        <div className="flex flex-row items-center justify-center h-screen w-full">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex justify-center px-2">
          <div className="bg-richblack-700 flex flex-col w-full max-w-[1200px] items-center mt-10 rounded-lg p-5">
            {/* Thumbnail and course info */}
            <div className="w-full flex flex-col md:flex-row gap-5">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <img
                  className="h-[180px] w-full max-w-[320px] md:h-[200px] rounded-md object-cover"
                  src={course?.thumbnail}
                  alt="Course Thumbnail"
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-white font-semibold text-2xl md:text-4xl">
                  {course?.courseName}
                </p>
                <p className="text-richblack-300 text-sm md:text-base max-w-5xl">
                  {course?.courseDescription}
                </p>

                <div className="mt-4 w-full p-2 md:p-4 rounded-lg flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex gap-3 items-center w-full md:w-[30%]">
                    <p className="text-white font-medium text-base md:text-lg">
                      Your Progress:
                    </p>
                    <p className="text-caribbeangreen-400 font-semibold">
                      {findbarLength()}%
                    </p>
                  </div>

                  <div className="w-full bg-richblack-600 rounded-full h-3 relative">
                    <div
                      className="bg-caribbeangreen-400 h-full transition-all duration-500 ease-in-out"
                      style={{ width: `${findbarLength()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content and Review Section */}
            <div className="flex flex-col lg:flex-row w-full mt-8 gap-6">
              <div className="w-full lg:w-8/12 bg-richblack-800 rounded-xl p-3">
                {course?.courseContent.map((section, index) => (
                  <div key={section?._id}>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 pl-5 my-3">
                      <p className="text-yellow-100  text-lg">
                        Chapter {index + 1}
                      </p>
                      <p className="text-yellow-100  text-lg">
                        {section?.sectionName}
                      </p>
                    </div>
                    {section.SubSection.map((subsec, inde) => (
                      <div key={subsec?._id} className="pl-6">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <p className="text-white text-base">
                            Lecture {inde + 1}
                          </p>
                          <p className="text-white text-base">{subsec.title}</p>
                        </div>
                        <div className="text-white flex flex-wrap gap-4 my-4">
                          <div
                            onClick={() => navigateToVideo(subsec?._id, subsec)}
                            className="flex items-center gap-2 bg-richblack-600 px-3 py-1 rounded-md hover:scale-105 transition hover:text-caribbeangreen-300 cursor-pointer"
                          >
                            <PiVideoFill size={22} />
                            <p>Watch Lecture</p>
                          </div>

                          <div className="flex items-center gap-2 bg-richblack-600 px-3 py-1 rounded-md hover:scale-105 transition hover:text-caribbeangreen-300 cursor-pointer">
                            <MdQuiz size={22} />
                            <p>Quiz (coming soon)</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Review Section */}
              <div className="bg-richblack-800 rounded-xl w-full lg:w-4/12 h-fit p-4">
                {isuserReviewed ? (
                  <div className="gap-2 py-4 flex flex-col items-center text-center">
                    <p className="text-yellow-100 text-xl font-semibold">
                      Thanks for your Review
                    </p>
                    <p className="text-richblack-400">
                      You have already rated this course. You can't review
                      again.
                    </p>
                  </div>
                ) : (
                  <div className="gap-2 py-4 flex flex-col">
                    <p className="text-yellow-100 text-xl font-semibold">
                      Give Review
                    </p>
                    <p className="text-white">
                      Tell us how much you like this course 😊.
                    </p>

                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-3 mt-3"
                    >
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <IoStar
                            key={star}
                            className="cursor-pointer"
                            color={
                              hover >= star
                                ? "#FFD700"
                                : rating >= star
                                ? "#FFD700"
                                : "#4A5568"
                            }
                            size={24}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                          />
                        ))}
                      </div>
                      <textarea
                        className="bg-richblack-700 text-white p-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-richblack-600"
                        placeholder="Write your review..."
                        rows="3"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="bg-yellow-100 text-richblack-800 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-200 transition-colors"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainViewCourse;
