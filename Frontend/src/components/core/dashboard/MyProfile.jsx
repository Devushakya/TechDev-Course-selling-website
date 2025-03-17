import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { getUserDetails } from "../../../services/operations/profileAPI";

const MyProfile = () => {
  const formattedDate = (date) => {
    if (!date) return "Add Date Of Birth";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [userData, setUserData] = useState(null);

  const getUserDetail = async () => {
    try {
      const response = await dispatch(getUserDetails(token));
      const data = response?.userDetail?.additionalDetails;
      setUserData(data || {});
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  if (!user) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col gap-7">
        <p className="font-semibold text-3xl text-white">My Profile</p>

        {/* First Box */}
        <div className="bg-richblack-800 border-2 border-richblack-500 flex flex-row justify-between rounded-md mt-7">
          <div className="flex flex-row py-3 px-3">
            <div className="rounded-full">
              <img
                className="aspect-square rounded-full object-cover"
                src={user.image || "/placeholder.png"}
                alt="Profile"
                height={60}
                width={60}
              />
            </div>
            <div className="flex flex-col justify-center pl-3">
              <p className="text-white font-bold text-xl">{`${user.firstName} ${user.lastName}`}</p>
              <p className="text-richblack-200">{user.email}</p>
            </div>
          </div>
          <div className="py-3 flex justify-center items-center pr-7">
            <div className="text-black bg-yellow-50 px-2 py-2 rounded-xl hover:bg-yellow-100">
              <Link
                className="flex flex-row justify-between items-center gap-3"
                to={"/dashboard/settings"}
              >
                <span>Edit</span>
                <FaEdit />
              </Link>
            </div>
          </div>
        </div>

        {/* Second Box */}
        <div className="bg-richblack-800 border-2 border-richblack-500 flex flex-row justify-between rounded-md mt-7">
          <div className="flex flex-col justify-center py-4 gap-7 pl-4">
            <p className="text-white font-bold text-xl">About</p>
            <p
              className={`${
                userData?.about ? "text-richblack-5" : "text-richblack-400"
              } text-sm font-medium`}
            >
              {userData?.about || "Write Something About Yourself"}
            </p>
          </div>
          <div className="flex justify-center items-center pr-7">
            <div className="text-black bg-yellow-50 px-2 py-2 rounded-xl hover:bg-yellow-100">
              <Link
                className="flex flex-row justify-between items-center gap-3"
                to={"/dashboard/settings"}
              >
                <span>Edit</span>
                <FaEdit />
              </Link>
            </div>
          </div>
        </div>

        {/* Third Box */}
        <div className="bg-richblack-800 border-2 border-richblack-500 flex flex-col justify-evenly rounded-md mt-7">
          <div className="flex flex-row justify-between pt-4 px-4">
            <span className="text-white font-bold text-xl">
              Personal Details
            </span>
            <div className="flex justify-center items-center pr-3">
              <div className="text-black bg-yellow-50 px-2 py-2 rounded-xl hover:bg-yellow-100">
                <Link
                  className="flex flex-row justify-between items-center gap-3"
                  to={"/dashboard/settings"}
                >
                  <span>Edit</span>
                  <FaEdit />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-evenly pb-4">
            <div className="flex flex-col gap-y-5 pl-4">
              <div>
                <p className="mb-2 text-sm text-richblack-400">First Name</p>
                <p className="text-sm font-medium text-richblack-5">
                  {user.firstName || "Add First Name"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-richblack-400">Email</p>
                <p className="text-sm font-medium text-richblack-5">
                  {user.email || "Add Email"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-richblack-400">Gender</p>
                <p className="text-sm font-medium text-richblack-5">
                  {userData?.gender || "Add Gender"}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-y-5 pr-4">
              <div>
                <p className="mb-2 text-sm text-richblack-400">Last Name</p>
                <p className="text-sm font-medium text-richblack-5">
                  {user.lastName || "Add Last Name"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-richblack-400">Phone Number</p>
                <p className="text-sm font-medium text-richblack-5">
                  {userData?.contactNumber || "Add Contact Number"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-richblack-400">Date Of Birth</p>
                <p className="text-sm font-medium text-richblack-5">
                  {formattedDate(userData?.dateOfBirth)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
