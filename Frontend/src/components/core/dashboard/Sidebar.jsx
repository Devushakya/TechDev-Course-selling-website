import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sidebarLinks } from "../../../data/dashboard-links";
import Sublinks from "./Sublinks";
import Modal from "../../common/Modal";
import { NavLink, matchPath, useLocation, useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { HiOutlineLogout } from "react-icons/hi";
import { logout } from "../../../services/operations/authAPI";
import { IoMdClose } from "react-icons/io";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user, loading: AuthLoading } = useSelector((state) => state.profile);
  const { loading: ProfileLoading } = useSelector((state) => state.profile);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visibleModal, setvisibleModal] = useState(null);

  if (ProfileLoading || AuthLoading) {
    return (
      <div className="flex flex-row items-center justify-center h-screen w-full">
        <div className="loader"></div>
      </div>
    );
  }

  const settingLink = {
    name: "Settings",
    path: "/dashboard/settings",
    icon: "IoMdSettings",
  };

  const matchRoute = (route) => matchPath({ path: route }, location.pathname);

  return (
    <>
      {/* Sidebar for desktop & animated mobile */}
      <div
        className={`bg-richblack-800 z-40 transition-transform duration-300 ease-in-out
    md:translate-x-0
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    fixed top-[3.5rem] left-0 h-screen w-[70%]
    md:static md:top-0 md:left-0 md:h-[calc(100vh-3.5rem)] md:w-[15%]
    pt-10 flex flex-col gap-2`}
      >
        {/* Close button for mobile */}

        <div className="flex md:hidden justify-end pr-4">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-white"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Links */}
        <div>
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return <Sublinks key={link.id} link={link} />;
          })}
        </div>

        {/* Divider */}
        <div className="flex flex-row items-center justify-center w-full">
          <div className="border-b-2 border-yellow-50 w-[80%] pt-5"></div>
        </div>

        {/* Settings and Logout */}
        <div>
          <NavLink
            to={settingLink.path}
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className={`flex flex-row items-center text-white gap-3 pl-4 py-2 rounded-md ${
                matchRoute(settingLink.path)
                  ? "bg-yellow-800 border-l-4 border-yellow-50"
                  : "hover:bg-richblack-700 bg-opacity-0"
              }`}
            >
              <IoMdSettings size={25} />
              <p className="text-lg">{settingLink.name}</p>
            </div>
          </NavLink>

          <div
            onClick={() =>
              setvisibleModal({
                text1: "Are you Sure?",
                text2: "You will be logged out from this Account.",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setvisibleModal(null),
                btn1text: "Logout",
                btn2text: "Cancel",
              })
            }
            className="flex flex-row items-center cursor-pointer text-white gap-3 pl-4 py-2 rounded-md"
          >
            <HiOutlineLogout size={25} />
            <p className="text-lg">Logout</p>
          </div>
        </div>
      </div>

      {/* Modal for logout confirmation */}
      {visibleModal && <Modal ModalData={visibleModal} />}
    </>
  );
};

export default Sidebar;
