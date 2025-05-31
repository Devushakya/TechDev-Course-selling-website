import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCatalogaPageData } from "../../../services/operations/pageAndComponentData";
import CourseSlider from "./CourseSlider";
import CourseSlider2 from "./CourseSlider2";
import Course_Card from "./Course_Card";

const CategoryMain = () => {
  const { category } = useParams();
  const categoryName = category.split("-").join(" ");
  const [categoryData, setCategoryData] = useState(null);
  const [shownew, setshownew] = useState(false);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const getdata = async () => {
      setloading(true);
      const result = await getCatalogaPageData(categoryName);
      setCategoryData(result);
      setshownew(false);
      setloading(false);
    };
    getdata();
  }, [category]);

  const handlemostpopular = () => setshownew(false);
  const handlenew = () => setshownew(true);

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center h-screen w-full">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-richblack-800 flex items-center justify-center">
        <div className="w-10/12 flex gap-3 flex-col my-9">
          <p className="text-white">
            Home/Catalog/
            <span className="text-yellow-50">
              {categoryData?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-white text-3xl">
            {categoryData?.selectedCategory?.name}
          </p>
          <p className="text-richblack-400">
            {categoryData?.selectedCategory?.description}
          </p>
        </div>
      </div>

      <div className="mt-7 mx-auto flex flex-col max-w-maxContent w-11/12 text-white justify-between">
        <p className="text-white text-4xl font-semibold">
          Courses to get you started
        </p>
        <div className="flex gap-6 mt-6 text-lg">
          <button
            onClick={handlemostpopular}
            className={
              !shownew
                ? "text-yellow-50 border-b-2 border-yellow-50"
                : "text-white"
            }
          >
            Most Popular
          </button>
          <button
            onClick={handlenew}
            className={
              shownew
                ? "text-yellow-50 border-b-2 border-yellow-50"
                : "text-white"
            }
          >
            New
          </button>
        </div>

        {/* Courses to get you started */}
        <div className="mt-5">
          <CourseSlider
            shownew={shownew}
            Courses={categoryData?.selectedCategory?.course}
            sortedCourses={categoryData?.sortedCourses}
          />
        </div>

        {/* Other Top Courses */}
        <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="section_heading text-white text-4xl font-semibold">
            Other Top Courses
          </div>
          <div className="py-8 overflow-x-auto no-scrollbar -mx-4 px-4 bg-richblack-800 rounded-lg">
            <div className="flex gap-4">
              {categoryData?.mostsellingCourse?.map((course, i) => (
                <div key={i} className="flex-shrink-0 mr-4 last:mr-0">
                  <Course_Card
                    course={course}
                    Height="h-[200px] sm:h-[250px] md:h-[300px]"
                    widthType="small"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frequently Bought */}
        <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="section_heading text-white text-4xl font-semibold">
            Frequently Bought
          </div>
          <div className="py-8 overflow-x-auto no-scrollbar -mx-4 px-4 bg-richblack-800 rounded-lg">
            <div className="flex gap-4">
              {categoryData?.differentcourse?.slice(0, 4).map((course, i) => (
                <div key={i} className="flex-shrink-0 mr-4 last:mr-0">
                  <Course_Card
                    course={course}
                    Height="h-[200px] sm:h-[250px] md:h-[300px]"
                    widthType="small"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryMain;
