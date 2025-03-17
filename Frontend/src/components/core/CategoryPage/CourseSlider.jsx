import React from "react";

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../../App.css"; // Ensure this comes last

import Course_Card from "./Course_Card";

const CourseSlider = ({ Courses, sortedCourses, shownew }) => {
  return (
    <>
      {shownew ? (
        Courses?.length ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            modules={[FreeMode, Pagination]}
            freeMode={true}
            pagination={{ clickable: true }}
            breakpoints={{
              1024: {
                slidesPerView: 3,
              },
            }}
            className="max-h-[30rem]"
          >
            {Courses?.map((course, i) => (
              <SwiperSlide key={i}>
                <Course_Card course={course} Height={"h-[250px]"} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-xl text-richblack-5">No Course Found</p>
        )
      ) : sortedCourses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          modules={[FreeMode, Pagination]}
          freeMode={true}
          pagination={{ clickable: true }}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]"
        >
          {sortedCourses?.map((course, i) => (
            <SwiperSlide key={i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  );
};

export default CourseSlider;
