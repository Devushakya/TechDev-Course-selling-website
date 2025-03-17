import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import RatingStars from "../components/common/RatingStars";
import GetAvgRating from "../utils/avgRating";
import { IoInformationCircleOutline, IoLanguage } from "react-icons/io5";
import CourseFloat from "../components/core/CoursePage/CourseFloat";
import calculateTotalCourseDuration from "../utils/calculateTotalCourseDuration";
import { TbLayoutNavbarCollapseFilled } from "react-icons/tb";
import { BsArrowsCollapse } from "react-icons/bs";
import CourseAccordionBar from "../components/core/CoursePage/CourseAccordionBar";
import Footer from "../components/common/Footer";
import Modal from "../components/common/Modal";
const CoursePage = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [ConfirmationModal, setConfirmationModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("reslult le lo ", course);
  const [isActive, setIsActive] = useState([]);
  // console.log("courseId", courseId);

  useEffect(() => {
    const getCourse = async () => {
      setLoading(true);
      const result = await fetchCourseDetails(courseId);
      if (result) {
        setCourse(result.data);
      }
      setLoading(false);
    };
    getCourse();
  }, [courseId]);

  useEffect(() => {
    setLoading(true);
    const getrating = async () => {
      const count = await GetAvgRating(course.ratingAndReview);
      setAvgReviewCount(count);
      setLoading(false);
    };
    getrating();
  }, [course]);

  const buyCoursehandler = async () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1text: "Login",
      btn2text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  function formatDateToDDMMYY(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    return `${day}-${month}-${year}`;
  }

  function findTotalSubSection(course) {
    if (!course || !course?.courseContent) {
      return 0;
    }

    const totalSubSections = course?.courseContent.reduce(
      (counter, section) => {
        return counter + (section.SubSection?.length || 0);
      },
      0
    );

    return totalSubSections;
  }

  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    );
  };

  const Handlecollapse = () => {
    setIsActive([]);
  };

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center h-screen   w-full">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <div className=" relative flex  justify-center  bg-richblack-800 ">
        <div className=" text-white w-11/12 my-14 flex flex-col gap-3">
          <p className=" text-4xl font-semibold ">{course?.courseName}</p>
          <p className=" text-richblack-500 max-w-[600px] ">
            {course?.courseDescription}
          </p>
          <div className=" flex flex-row gap-4">
            <RatingStars Review_Count={avgReviewCount} />
            <p>{`(${course?.ratingAndReview.length} Reviews)`}</p>
            <p>{`${course?.studentsEnrolled.length} Students Enrolled`}</p>
          </div>
          <p>
            Created By{" "}
            <span className=" text-yellow-100">
              {course?.instructor.firstName} {course?.instructor.lastName}
            </span>
          </p>
          <div className=" flex flex-row gap-6 items-center ">
            <div className=" flex flex-row gap-2 items-center ">
              <IoInformationCircleOutline />
              <p>Created At: {formatDateToDDMMYY(course?.createdAt)}</p>
            </div>
            <div className=" flex flex-row gap-2 items-center ">
              <IoLanguage />
              <p>English, Hindi</p>
            </div>
          </div>
        </div>
        <CourseFloat
          setConfirmationModal={setConfirmationModal}
          course={course}
          buyCoursehandler={buyCoursehandler}
        />
      </div>
      <div className=" bg-yellow-50 h-[2px]"></div>
      <div className=" ml-14 w-7/12 text-white  ">
        <div className=" border-2 border-richblack-600 rounded-lg gap-4 mt-8 px-5 py-3 flex flex-col ">
          <p className=" text-2xl font-semibold">What You will learn</p>
          <p className=" text-sm">{course?.whatYouWillLearn}</p>
        </div>
        <div className=" mt-4 ">
          <p className=" text-2xl font-semibold">Course Content</p>
          <div className="flex flex-row justify-between mt-1">
            <p>
              <span>{course?.courseContent.length}</span> section(s){" "}
              <span> {findTotalSubSection(course)} </span>
              subsections(s) <span>
                {calculateTotalCourseDuration(course)}
              </span>{" "}
              total length{" "}
            </p>
            <button
              onClick={Handlecollapse}
              className=" flex flex-row  items-center gap-2 text-yellow-100 text-xl"
            >
              <p>Collapse</p>
              <BsArrowsCollapse />
            </button>
          </div>

          <div className="py-4">
            {course?.courseContent?.map((course, index) => (
              <CourseAccordionBar
                course={course}
                key={index}
                isActive={isActive}
                handleActive={handleActive}
              />
            ))}
          </div>

          <div className=" mb-6">
            <p className=" text-2xl font-semibold">Instructor</p>
            <div className=" flex flex-row items-center gap-6 text-white text-lg ml-5 mt-3">
              <div className=" rounded-full  ">
                {" "}
                <img
                  className=" rounded-full h-12 w-12 object-cover"
                  src={course?.instructor?.image}
                ></img>{" "}
              </div>
              <p>
                {" "}
                <span> {course?.instructor?.firstName} </span>
                <span> {course?.instructor?.lastName} </span>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {ConfirmationModal && <Modal ModalData={ConfirmationModal} />}
    </div>
  );
};

export default CoursePage;
