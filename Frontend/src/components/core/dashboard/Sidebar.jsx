import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sidebarLinks } from "../../../data/dashboard-links";
import Sublinks from "./Sublinks";
import Modal from "../../common/Modal";
import {
  Link,
  NavLink,
  matchPath,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { HiOutlineLogout } from "react-icons/hi";
import { logout } from "../../../services/operations/authAPI";

const Sidebar = () => {
  const { user, loading: AuthLoading } = useSelector((state) => state.profile);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   console.log("user is", user);
  const { loading: ProfileLoading } = useSelector((state) => state.profile);
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
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="w-[15%] relative">
      <div className=" bg-richblack-800 h-[calc(100vh-3.5rem)]  pt-10 flex flex-col gap-2   ">
        <div>
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) {
              return null;
            }
            return <Sublinks key={link.id} link={link} />;
          })}
        </div>

        <div className="flex flex-row items-center justify-center w-full">
          <div className=" border-b-2 border-yellow-50 w-[80%] pt-5 "> </div>
        </div>

        {/* setting and logout */}
        <div>
          <NavLink to={settingLink.path}>
            <div
              className={`flex flex-row items-center text-white gap-3 pl-4 py-2 rounded-md ${
                matchRoute(settingLink.path)
                  ? "bg-yellow-800 border-l-4 border-yellow-50"
                  : "hover:bg-richblack-700 bg-opacity-0"
              }`}
            >
              <IoMdSettings size={25}></IoMdSettings>
              <p className=" text-lg">{settingLink.name}</p>
            </div>
          </NavLink>
          <div
            onClick={() =>
              setvisibleModal({
                text1: "Are you Sure?",
                text2: "You will be logged out from this Account.",
                btn1Handler: () => {
                  dispatch(logout(navigate));
                },
                btn2Handler: () => setvisibleModal(null),
                btn1text: "Logout",
                btn2text: "Cancel",
              })
            }
            className={`flex flex-row items-center cursor-pointer text-white gap-3 pl-4 py-2 rounded-md`}
          >
            <HiOutlineLogout size={25}></HiOutlineLogout>
            <p className="text-lg">Logout</p>
          </div>
        </div>
      </div>

      {visibleModal && <Modal ModalData={visibleModal} />}
    </div>
  );
};

export default Sidebar;
