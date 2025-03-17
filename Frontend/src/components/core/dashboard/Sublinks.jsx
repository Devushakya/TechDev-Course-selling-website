import React from "react";
import * as Icons from "react-icons/vsc";

import { useDispatch } from "react-redux";
import { matchPath, NavLink, useLocation } from "react-router-dom";

const Sublinks = ({ link }) => {
  const Icon = Icons[link.icon];
  const location = useLocation();
  const dispatch = useDispatch();

  const matchRoute = (route) => {
    // console.log("matchroute",route,location.pathname);
    return matchPath({ path: route }, location.pathname);
  };
  return (
    <NavLink to={link.path}>
      <div
        className={`flex flex-row items-center text-white gap-3 pl-4 py-2 rounded-md ${
          matchRoute(link.path)
            ? "bg-yellow-800 border-l-4 border-yellow-50"
            : "hover:bg-richblack-700 bg-opacity-0"
        }`}
      >
        <Icon size={25}></Icon>
        <p className=" text-lg">{link.name}</p>
      </div>
    </NavLink>
  );
};

export default Sublinks;
