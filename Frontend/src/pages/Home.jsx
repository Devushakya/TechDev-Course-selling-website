import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRightLong, FaArrowRight } from "react-icons/fa6";
import HighlightText from "../components/core/homepage/HighlightText";
import CodeBlocks from "../components/core/homepage/CodeBlocks";
import Banner from "../assets/Images/banner.mp4";
import CBAButton from "../components/core/homepage/CBAButton";
import TimelineSection from "../components/core/homepage/TimelineSection";
import InstructorSection from "../components/core/homepage/InstructorSection";
import LearningLanguage from "../components/core/homepage/LearningLanguageSection";
import ExploreMore from "../components/core/homepage/ExploreMore";
import Footer from "../../src/components/common/Footer"
const Home = () => {
  return (
    <div>
      {/* section 1 */}
      <div className="relative mx-auto flex flex-col max-w-maxContent w-11/12 items-center text-white justify-between">
        <Link to={"/signup"}>
          <div className="group mx-auto font-bold text-richblack-300 mt-16 p-1 transition-all duration-200  bg-richblack-800 rounded-full hover:scale-95 w-fit ">
            <div className="flex items-center gap-2 px-10 py-[5px] rounded-full transition-all duration-200  group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRightLong />
            </div>
          </div>
        </Link>
        <div className=" font-semibold text-4xl mt-4 ">
          <p>
            Empower Your Future with <HighlightText text="Coding Skills" />{" "}
          </p>
        </div>
        <div className="w-[90%] font-bold text-lg text-richblack-300 mt-7 text-center ">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>
        <div className="flex flex-row gap-7 mt-8">
          <CBAButton active={true} linkto={"/signup"}>
            Learn More
          </CBAButton>
          <CBAButton active={false} linkto={"/signup"}>
            Book a Demo
          </CBAButton>
        </div>
      </div>

      {/* video  */}
      <div className="relative mx-auto mt-16 my-7 w-9/12 flex items-center justify-center">
        {/* White Background Div */}
        <div className="absolute bg-white w-full h-full top-4 left-4 shadow-lg"></div>

        {/* Video Card */}
        <div
          className="relative shadow-xl overflow-hidden "
          style={{ boxShadow: "-15px -15px 30px rgba(27, 185, 252, 0.5)" }}
        >
          <video className="w-full h-auto " muted loop autoPlay>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Code Section 1  */}
      <div>
        <CodeBlocks
          position={"lg:flex-row"}
          heading={
            <div className="text-4xl font-semibold">
              Unlock your
              <HighlightText text={" coding potential"} /> with our online
              courses.
            </div>
          }
          subheading={
            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
          }
          ctabutton1={{
            btnText: "Try it Yourself",
            link: "/signup",
            active: true,
          }}
          ctabutton2={{
            btnText: "Learn More",
            link: "/signup",
            active: false,
          }}
          codeColor={"text-yellow-25"}
          codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a>\n <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
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
              <HighlightText text={" coding in seconds"} />
            </div>
          }
          subheading={
            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
          }
          ctabutton1={{
            btnText: "Continue Lesson",
            link: "/signup",
            active: true,
          }}
          ctabutton2={{
            btnText: "Learn More",
            link: "/signup",
            active: false,
          }}
          codeColor={"text-white"}
          codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
          backgroundGradient={<div className="codeblock2 absolute"></div>}
        />
      </div>

      <ExploreMore></ExploreMore>


      {/* ab aange ka section */}
      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="bg_home h-[320px]">
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CBAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CBAButton>
              <CBAButton active={false} linkto={"/login"}>
                Learn More
              </CBAButton>
            </div>
          </div>
        </div>
      </div>

      <div className=" bg-white h-full w-full ">
        <div className=" pt-7 flex flex-row max-w-maxContent w-11/12  gap-7  justify-evenly items-center mx-auto">
          <div className=" text-richblack-800 text-4xl font-semibold w-[40%]">
            Get the skills you need for a{" "}
            <HighlightText text={" job that is in demand."}></HighlightText>
          </div>
          <div className=" w-[40%] gap-10 flex flex-col  ">
            <div>
              The modern TechDev is the dictates its own terms. Today, to be a
              competitive specialist requires more than professional skills.
            </div>
            <CBAButton active={true} linkto={"/signup"}>
              Learn More
            </CBAButton>
          </div>
        </div>
      </div>

      <TimelineSection></TimelineSection>

      <LearningLanguage></LearningLanguage>

      <InstructorSection></InstructorSection>

      <Footer></Footer>
    </div>
  );
};

export default Home;
