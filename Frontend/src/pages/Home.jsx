import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRightLong, FaArrowRight } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";

import HighlightText from "../components/core/homepage/HighlightText";
import CodeBlocks from "../components/core/homepage/CodeBlocks";
import CBAButton from "../components/core/homepage/CBAButton";
import TimelineSection from "../components/core/homepage/TimelineSection";
import InstructorSection from "../components/core/homepage/InstructorSection";
import LearningLanguage from "../components/core/homepage/LearningLanguageSection";
import ExploreMore from "../components/core/homepage/ExploreMore";
import Footer from "../../src/components/common/Footer";

const Home = () => {
  useEffect(() => {
    const checkBackendConnection = async () => {
      if (sessionStorage.getItem("backendChecked")) return;

      const toastId = toast.loading("Connecting to backend...");

      try {
        const response = await fetch(
          "https://techdev-course-selling-website-backend.onrender.com/api/v1/connectBackend"
        );
        const data = await response.json();

        if (response.ok && data.success) {
          toast.success("Connected to backend!", { id: toastId });
          sessionStorage.setItem("backendChecked", "true");
        } else {
          throw new Error("Connection failed");
        }
      } catch (error) {
        toast.error("Failed to connect to backend!", { id: toastId });
      }
    };

    checkBackendConnection();
  }, []);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      {/* section 1 */}
      <div className="relative mx-auto flex flex-col mb-6 max-w-maxContent w-11/12 items-center text-white justify-between">
        <Link to={"/signup"}>
          <div className="group mx-auto font-bold text-richblack-300 mt-16 p-1 transition-all duration-200 bg-richblack-800 rounded-full hover:scale-95 w-fit">
            <div className="flex items-center gap-2 px-10 py-[5px] rounded-full transition-all duration-200 group-hover:bg-richblack-900">
              <p>Join as an Instructor</p>
              <FaArrowRightLong />
            </div>
          </div>
        </Link>
        <div className="font-semibold text-4xl text-center mt-4">
          <p>
            Build Your Future with <HighlightText text="Top Coding Skills" />
          </p>
        </div>
        <div className="w-[90%] font-bold text-lg text-richblack-300 mt-7 text-center">
          Learn coding at your own pace, from anywhere, with access to engaging
          projects, interactive quizzes, and expert feedback to guide your
          journey.
        </div>
        <div className="flex flex-row gap-7 mt-8">
          <CBAButton active={true} linkto={"/signup"}>
            Get Started
          </CBAButton>
          <CBAButton active={false} linkto={"/signup"}>
            Try a Demo
          </CBAButton>
        </div>
      </div>

      <TimelineSection />
      <LearningLanguage />
      <InstructorSection />

      {/* Code Section 1 */}
      <div>
        <CodeBlocks
          position={"lg:flex-row"}
          heading={
            <div className="text-4xl font-semibold">
              Unlock your
              <HighlightText text={" coding potential"} /> with expert-led
              courses.
            </div>
          }
          subheading={
            "Our programs are crafted by seasoned professionals passionate about helping you master real-world coding skills."
          }
          ctabutton1={{
            btnText: "Try it Yourself",
            link: "/signup",
            active: true,
          }}
          ctabutton2={{
            btnText: "Discover More",
            link: "/signup",
            active: false,
          }}
          codeColor={"text-yellow-25"}
          codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Simple Page</title>\n</head>\n<body>\n  <header>\n    <h1>Welcome!</h1>\n    <nav>\n      <a href="#home">Home</a>\n      <a href="#about">About</a>\n    </nav>\n  </header>\n  <main>\n    <section>\n      <p>This is a demo page with basic layout.</p>\n    </section>\n  </main></body>\n</html>`}
          backgroundGradient={<div className="codeblock1 absolute"></div>}
        />
      </div>

      {/* Code Section 2 */}
      <div>
        <CodeBlocks
          position={"lg:flex-row-reverse"}
          heading={
            <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
              Start
              <HighlightText text={" coding right away"} />
            </div>
          }
          subheading={
            "Jump in and start coding from lesson one. Our interactive platform lets you practice as you learn."
          }
          ctabutton1={{
            btnText: "Resume Learning",
            link: "/signup",
            active: true,
          }}
          ctabutton2={{
            btnText: "Discover More",
            link: "/signup",
            active: false,
          }}
          codeColor={"text-white"}
          codeblock={`import React, { useState } from "react";\n\nconst Counter = ({ initial }) => {\n  const [count, setCount] = useState(initial);\n\n  const increment = () => setCount(count + 1);\n  const decrement = () => setCount(count - 1);\n\n  return (\n    <div>\n      <h1>Count: {count}</h1>\n      <button onClick={increment}>+</button>\n      <button onClick={decrement}>-</button>\n    </div>\n  );\n};\n\nexport default Counter;`}
          backgroundGradient={<div className="codeblock2 absolute"></div>}
        />
      </div>

      <ExploreMore />

      {/* Final Section */}
      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="bg_home h-[150px] md:h-[280px] lg:h-[320px]">
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CBAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Browse Full Catalog
                  <FaArrowRight />
                </div>
              </CBAButton>
              <CBAButton active={false} linkto={"/login"}>
                Find Out More
              </CBAButton>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white pb-6 h-full w-full">
        <div className="pt-7 flex flex-row max-w-maxContent w-11/12 gap-7 justify-evenly items-center mx-auto">
          <div className="text-richblack-800 text-4xl font-semibold w-[40%]">
            Gain the skills you need for a{" "}
            <HighlightText text={" high-demand career."} />
          </div>
          <div className="w-[40%] gap-10 flex flex-col">
            <div>
              Today’s tech world moves fast. To stay ahead, you need more than
              just basic skills — you need an edge.
            </div>
            <CBAButton active={true} linkto={"/signup"}>
              Get Started
            </CBAButton>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
