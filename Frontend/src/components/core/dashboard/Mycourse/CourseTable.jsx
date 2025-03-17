import React, { useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { IoMdStopwatch } from "react-icons/io";
import { MdCloudDone } from "react-icons/md";
import { Table, Tbody, Th, Thead, Tr, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Modal from "../../../common/Modal";
import { MdDelete, MdOutlineModeEdit } from "react-icons/md";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ImageWithSkeleton = ({ src, alt, skeletonClass, imgClass }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      {loading && <div className={skeletonClass}></div>}
      <img
        src={src}
        alt={alt}
        className={`${imgClass} ${loading ? "hidden" : ""}`}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </div>
  );
};

const CourseTable = ({ course, setCourse }) => {
  const { token } = useSelector((state) => state.auth);
  const [modal, setModal] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function formatDateToDDMMYY(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    return `${day}-${month}-${year}`;
  }

  function calculateTotalCourseDuration(course) {
    let totalDurationInSeconds = 0;

    course.courseContent.forEach((section) => {
      section.SubSection.forEach((subSection) => {
        totalDurationInSeconds += parseFloat(subSection.timeDuration);
      });
    });

    const hours = Math.floor(totalDurationInSeconds / 3600);
    const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
    const seconds = Math.floor(totalDurationInSeconds % 60);

    let formattedDuration = [];
    if (hours > 0) formattedDuration.push(`${hours} hr`);
    if (minutes > 0) formattedDuration.push(`${minutes} min`);
    if (seconds > 0 || formattedDuration.length === 0)
      formattedDuration.push(`${seconds} sec`);

    return formattedDuration.join(" ");
  }

  const DeletCourse = async (courseId) => {
    setModal(null);
    const nothing = await deleteCourse({ courseId, token });

    const result = await fetchInstructorCourses(token);
    if (result) {
      dispatch(setCourse(result));
    }
  };

  const EditCourse = (courseId) => {
    navigate(`/dashboard/edit-course/${courseId}`);
  };

  return (
    <div>
      <Table className="text-white">
        <Thead>
          <Tr>
            <Th>Courses</Th>
            <Th>Duration</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {course.map((data) => (
            <Tr key={data._id}>
              <Td>
                <div className="flex gap-4 md:flex-row flex-col mt-8">
                  <ImageWithSkeleton
                    src={data.thumbnail}
                    alt={data.courseName}
                    skeletonClass="h-[150px] w-[220px] bg-gray-300 animate-pulse rounded-lg"
                    imgClass="h-[150px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-lg">{data?.courseName}</p>
                    <p className="max-w-[400px] text-sm text-richblack-500">
                      {data?.courseDescription}
                    </p>
                    <p className="text-sm">
                      Created At: {formatDateToDDMMYY(data?.createdAt)}
                    </p>
                    <div
                      className={`flex gap-2 items-center justify-center bg-richblack-700 w-fit rounded-lg px-2 min-w-[110px] ${
                        data.status === "Draft"
                          ? "text-pink-300"
                          : "text-caribbeangreen-300"
                      }`}
                    >
                      {data?.status === "Draft" ? (
                        <IoMdStopwatch />
                      ) : (
                        <MdCloudDone />
                      )}
                      <p>{data?.status}</p>
                    </div>
                  </div>
                </div>
              </Td>
              <Td>{calculateTotalCourseDuration(data)} </Td>
              <Td>
                <div className="flex items-center">
                  <FaRupeeSign />
                  <p>{data.price}</p>
                </div>
              </Td>
              <Td>
                <div className="ml-4 flex gap-3">
                  <button
                    onClick={() => {
                      EditCourse(data._id);
                    }}
                    className="text-yellow-100"
                    type="button"
                  >
                    <MdOutlineModeEdit size={25} />
                  </button>
                  <button
                    className="text-[#ff1512]"
                    type="button"
                    onClick={() => {
                      setModal({
                        text1: "Are you Sure?",
                        text2:
                          "Once you click Delete, we can't recover your account.",
                        btn1Handler: () => {
                          DeletCourse(data._id);
                        },
                        btn2Handler: () => {
                          setModal(null);
                        },
                        btn1text: "Delete",
                        btn2text: "Cancel",
                      });
                    }}
                  >
                    <MdDelete size={25} />
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {modal && <Modal ModalData={modal} />}
    </div>
  );
};

export default CourseTable;
