import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import { GrAddCircle } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";
import NestedView from "../NestedView";

const CourseBuilder2 = () => {
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.course);
  // console.log("course original",course);
  const { token } = useSelector((state) => state.auth);

  // console.log("course aa gaya", course);
  const {
    setValue,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [editSection, seteditSection] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChangeEditSectionName = (sectionID, sectionName) => {
    if (editSection === sectionID) {
      canceledit();
      return;
    }
    seteditSection(sectionID);
    setValue("sectionName", sectionName);
  };

  const canceledit = () => {
    seteditSection(false);
    setValue("sectionName", "");
  };

  const goBack = () => {
    dispatch(setEditCourse(true));
    dispatch(setStep(1));
  };

  useEffect(() => {
    // console.log("Updated course:", course);
  }, [course]);

  const onsubmit = async (data) => {
    setLoading(true);
    let result;

    if (editSection) {
      // Update an existing section
      result = await updateSection(
        {
          sectionName: data?.sectionName,
          sectionID: editSection,
          courseId: course?._id,
        },
        token
      );
    } else {
      // Create a new section
      result = await createSection(
        {
          sectionName: data?.sectionName,
          courseID: course?._id,
        },
        token
      );
    }

    // console.log("result of secton", result);
    if (result) {
      dispatch(setCourse(result));
      seteditSection(null);
      setValue("sectionName", "");
    }
    setLoading(false);
  };

  const goNext = () => {
    //checking basic condtiton for empty section
    if (course.courseContent.length === 0) {
      toast.error("Please create at least one section");
      return;
    }
    if (course.courseContent[0].SubSection.length === 0) {
      toast.error("Please add atleast one lecture in each subSection");
      return;
    }
    // console.log("clicking");
    dispatch(setStep(3));
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 max-w-xl">
      <p className=" text-white text-2xl font-semibold">Course Builder</p>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div>
          <label className="text-sm text-richblack-5" htmlFor="sectionName ">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            placeholder="Enter your section name"
            {...register("sectionName", { required: true })}
            className="form-style  border border-richblack-500 rounded-md p-2 mt-2 w-full text-white bg-richblack-700"
          ></input>
          {errors.sectionName && <span>Section name is required</span>}
        </div>
        <div className=" mt-5 flex flex-row gap-3">
          <button
            className=" text-yellow-100 border-2 rounded-md border-yellow-50 flex flex-row items-center justify-center gap-2 px-2 py-2  "
            type="submit"
          >
            {editSection ? "Edit Section Name" : "Create Section"}
            <GrAddCircle />
          </button>
          {editSection && (
            <button
              className=" text-richblack-600 text-lg hover:underline"
              type="button"
              onClick={canceledit}
            >
              cancel
            </button>
          )}
        </div>
      </form>

      {course?.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      <div className="flex gap-4  justify-end pr-7 w-full">
        <button
          onClick={goBack}
          className="text-center text-[13px] px-6 py-2 rounded-md text-md  font-bold bg-richblack-700 text-white"
        >
          Go Back
        </button>
        <button
          onClick={goNext}
          className="text-center text-[13px] px-6 py-2 rounded-md text-md  font-bold bg-yellow-50 text-black "
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseBuilder2;
