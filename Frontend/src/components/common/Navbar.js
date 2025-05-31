import React, { useState, useEffect } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoCart } from "react-icons/io5";
import { BsChevronDown } from "react-icons/bs";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/Logo/TechDev-removebg-preview.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiConnect";
import { categories } from "../../services/apis";
import Profile from "./Profile";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        if (res.data?.success) {
          setSubLinks(res.data.allCategorys || []);
        }
      } catch (error) {
        console.error("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  const matchRoutes = (route) => matchPath({ path: route }, location.pathname);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileCatalogOpen(false);
  }, [location.pathname]);

  return (
    <div
      className={`relative h-14 flex items-center justify-center border-b-[1px] border-richblack-700 overflow-visible ${
        location.pathname === "/" ? " bg-richblack-900" : "bg-richblack-800"
      }`}
    >
      <div className="flex flex-row w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo for both desktop and mobile */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={logo}
            alt="logo"
            height={42}
            width={160}
            loading="lazy"
            className="hidden md:block"
          />
          <img
            src={logo}
            alt="logo"
            height={42}
            width={120}
            loading="lazy"
            className="md:hidden"
          />
        </Link>

        {/* --- MOBILE HEADER (cart, profile, hamburger) --- */}
        <div className="flex items-center gap-2 md:hidden">
          {user && user?.accountType !== "Instructor" && (
            <Link
              to="/dashboard/cart"
              className="text-white relative flex justify-center items-center"
            >
              <IoCart className="w-7 h-7" />
              {totalItems > 0 && (
                <div className="absolute top-0 right-0 transform translate-x-[50%] translate-y-[-50%] flex justify-center items-center rounded-full bg-yellow-50 text-black w-5 h-5 text-xs">
                  {totalItems}
                </div>
              )}
            </Link>
          )}
          <Profile />
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="ml-2 text-white focus:outline-none"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden md:flex flex-1 justify-center">
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
                    {/* Dropdown */}
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

        {/* --- DESKTOP CART & PROFILE --- */}
        <div className="hidden md:flex flex-row gap-4 items-center">
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
          <Profile />
        </div>

        {/* --- DESKTOP AUTH BUTTONS --- */}
        <div className="hidden md:flex gap-4">
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

      {/* --- MOBILE MENU OVERLAY --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[2000] bg-black bg-opacity-80 flex flex-col items-end md:hidden">
          <div className="w-4/5 max-w-xs h-full bg-richblack-900 p-6 flex flex-col gap-6">
            <button
              className="self-end mb-4"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <FiX size={28} className="text-white" />
            </button>
            <ul className="flex flex-col gap-4">
              {NavbarLinks.map((link, idx) =>
                link.title === "Catalogs" ? (
                  <li key={idx}>
                    <button
                      className="flex items-center gap-2 w-full text-left text-richblack-25"
                      onClick={() => setMobileCatalogOpen((prev) => !prev)}
                    >
                      {link.title}
                      <BsChevronDown
                        className={`transition-transform ${
                          mobileCatalogOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileCatalogOpen && (
                      <div className="ml-4 mt-2 flex flex-col gap-2">
                        {loading ? (
                          <p>Loading...</p>
                        ) : subLinks.length > 0 ? (
                          subLinks.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="py-2 pl-2 text-richblack-100 hover:bg-richblack-800 rounded"
                              key={i}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subLink.name}
                            </Link>
                          ))
                        ) : (
                          <p>No Categories Found</p>
                        )}
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="block text-richblack-25 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.title}
                    </Link>
                  </li>
                )
              )}
            </ul>
            {!token && (
              <div className="flex flex-col gap-2 mt-4">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                    Log in
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                    Sign up
                  </button>
                </Link>
              </div>
            )}
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
