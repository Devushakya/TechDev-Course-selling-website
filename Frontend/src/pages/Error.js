import React from "react";
import bg from "../assets/Images/1.png";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="relative flex justify-center items-center h-[calc(100vh-4rem)] text-white">
      
      <img
        src={bg}
        loading="lazy"
        className="hidden lg:block h-full w-full object-cover"
      />
     
      <div
        className="absolute flex flex-col items-center justify-center text-center 
        translate-x-0 translate-y-0 lg:translate-x-[55%] lg:translate-y-[60%]"
      >
        <p className="text-5xl font-semibold mb-3">Page not found!</p>
        <p className="text-2xl w-[90%] sm:w-[70%]">
          The requested page could not be found on the server.
        </p>
        <Link to="/">
          <div className="cursor-pointer rounded-2xl border-2 border-white py-2 px-5 mt-9">
            Go Home
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Error;
