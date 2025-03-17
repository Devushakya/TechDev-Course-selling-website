import React, { useState, useEffect } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoCart } from "react-icons/io5";
import { BsChevronDown } from "react-icons/bs";
import logo from "../../assets/Logo/TechDev-removebg-preview.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiConnect";
import { categories } from "../../services/apis";
import Profile from "./Profile";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  // console.log("navbar ka user", user);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        if (res.data?.success) {
          setSubLinks(res.data.allCategorys || []);
        } else {
          console.error("Failed to fetch categories:", res.data?.message);
        }
      } catch (error) {
        console.error("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  const matchRoutes = (route) => matchPath({ path: route }, location.pathname);

  return (
    <div
      className={`h-14 flex items-center justify-center border-b-[1px] border-richblack-700 overflow-visible ${
        location.pathname === "/" ? " bg-richblack-900" : "bg-richblack-800"
      } `}
    >
      <div className="flex flex-row w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="logo" height={42} width={160} loading="lazy" />
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex flex-row gap-4">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalogs" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoutes("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks.length > 0 ? (
                        subLinks.map((subLink, i) => (
                          <Link
                            to={`/catalog/${subLink.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()}`}
                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                            key={i}
                          >
                            <p className="text-black">{subLink.name}</p>
                          </Link>
                        ))
                      ) : (
                        <p className="text-center">No Categories Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    {link.path === "/dashboard/my-profile" ? (
                      user && (
                        <p
                          className={`${
                            matchRoutes(link?.path)
                              ? "text-yellow-25"
                              : "text-richblack-25"
                          }`}
                        >
                          {link.title}
                        </p>
                      )
                    ) : (
                      <p
                        className={`${
                          matchRoutes(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className=" flex flex-row gap-4">
          {/* Cart Icon */}
          <div className="flex gap-4 items-center relative">
            {user && user?.accountType !== "Instructor" && (
              <Link
                to="/dashboard/cart"
                className="text-white relative flex justify-center items-center"
              >
                <IoCart className="w-8 h-8 text-white" />
                {totalItems > 0 && (
                  <div className="absolute top-0 right-0 transform translate-x-[50%] translate-y-[-50%] flex justify-center items-center rounded-full bg-yellow-50 text-black w-5 h-5 text-sm">
                    {totalItems}
                  </div>
                )}
              </Link>
            )}
          </div>
          <Profile />
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          {!token && (
            <>
              <Link to="/login">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
