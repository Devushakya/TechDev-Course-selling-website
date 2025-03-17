import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleDown, FaUserCircle } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/operations/authAPI";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const profiledrop = [
    {
      title: "My Profile",
      logo: FaUserCircle,
      link: "dashboard/my-profile",
    },
    {
      title: "Settings",
      logo: IoSettings,
      link: "dashboard/settings",
    },
  ];

  const clickHandler = () => {
    dispatch(logout(navigate));
  };

  return (
    <div className="relative group">
      <div className="flex flex-row text-white ">
        {user && (
          <div className=" rounded flex flex-row items-center justify-center gap-1 ">
            <img
              src={user?.image}
              className="aspect-square w-[30px] rounded-full object-cover"
            ></img>
            <FaAngleDown />
          </div>
        )}
      </div>
      <div className=" w-40 invisible absolute left-[50%] top-[50%] z-[1000] flex  translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-700 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 ">
        {profiledrop.map((Value, index) => {
          let Icon = Value.logo;
          return (
            <div>
              <Link
                key={index}
                className=" text-white w-full flex flex-row p-3 hover:bg-richblack-600 gap-3  justify-start rounded-xl"
                to={Value.link}
              >
                <Icon size={25}></Icon>
                <p className=" w-full  ">{Value.title}</p>
              </Link>
            </div>
          );
        })}

        <div
          onClick={clickHandler}
          className=" text-white flex flex-row p-3 hover:bg-richblack-600 hover:cursor-pointer gap-3 items-center justify-start rounded-xl "
        >
          <FiLogOut></FiLogOut>
          <p> Log out </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
