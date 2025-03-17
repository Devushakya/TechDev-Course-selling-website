import React, { useEffect, useState } from "react";
import { CgSoftwareUpload } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../../../../services/operations/profileAPI";
import { RiDeleteBinLine } from "react-icons/ri";
import Modal from "../../../common/Modal";
import {
  deleteProfile,
  changePassword,
  updateProfile,
  updateDisplayPicture,
} from "../../../../services/operations/SettingsAPI";
import toast from "react-hot-toast";


const Setting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  // console.log("user setting ka", user);
  const { token } = useSelector((state) => state.auth);
  // console.log("token", token);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showoldpassword, setshowoldpassword] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    password: "",
    confirmPassword: "",
    oldPassword: "",
  });
  const [profileFormData, setProfileFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    date: user?.date || "",
    gender: user?.gender || "",
    phoneno: user?.phoneno || "",
    about: user?.about || "",
  });
  const [visibleModal, setVisibleModal] = useState(null);

  const handlePasswordChange = (e) => {
    setPasswordFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileChange = (e) => {
    setProfileFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileSave = () => {
    console.log("Profile data saved:", profileFormData);
    const dataToSend = {
      firstName: profileFormData?.firstname,
      lastName: profileFormData?.lastname,
      gender: profileFormData?.gender,
      dateOfBirth: profileFormData?.date,
      about: profileFormData?.about,
      contactNumber: profileFormData?.phoneno,
    };
    dispatch(updateProfile(token, dataToSend));
  };

  const handlePasswordSave = () => {
    // console.log("inside save password");

    if (passwordFormData.password !== passwordFormData.confirmPassword) {
      toast.error("Password do not match");
      return;
    }
    // console.log("password form data", passwordFormData);

    const dataToSend = {
      email: user?.email,
      oldPassword: passwordFormData?.oldPassword,
      newPassword: passwordFormData?.password,
      confirmPassword: passwordFormData?.confirmPassword,
    };
    console.log("Data to send", dataToSend);
    dispatch(changePassword(token, dataToSend));
  };

  // profile photo all thing

  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelectImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
    // console.log("image aa gye", file);
  };

  const handleUploadImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first.");
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append("displayPicture", selectedImage); // The key should match what your backend expects

    // Dispatch the action with FormData
    dispatch(updateDisplayPicture(token, formData));
  };




  const [userData, setuserData] = useState(null); 
   const getuserDetail = async () => {
     try {
       console.log("Calling getUserDetails API...");

       // Await the dispatched action to get the resolved response
       const response = await dispatch(getUserDetails(token));
       const data = response.userDetail?.additionalDetails;
       console.log("userData", data);
       setuserData(data);
     } catch (error) {
       console.error("Error fetching user details:", error);
     }
   };

    useEffect(() => {
    
    getuserDetail();  
  }, []);


  return (
    <div className="container mx-auto">
      <p className="text-white text-4xl font-semibold mb-8">My Setting</p>

      {/* Profile Picture Section */}
      <div className="bg-richblack-800 border-2 border-richblack-500 flex flex-row items-center gap-5 py-3 rounded-md mb-8">
        <div className="rounded-full px-5">
          <img
            className="aspect-square rounded-full object-cover"
            src={user?.image || "default-profile.png"}
            alt="Profile Picture"
            height={60}
            width={60}
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-white text-xl">Change Profile Picture</p>
          <div className="flex flex-row items-center gap-4">
            {/* Select Button */}
            <label className="text-center text-[13px] px-6 py-3 hover:cursor-pointer rounded-md font-bold bg-yellow-50 text-black hover:scale-90 transition-all duration-200 inline-block">
              {selectedImage === null ? "Select" : "Selected"}
              <input
                type="file"
                accept="image/*"
                onChange={handleSelectImage}
                className="hidden"
              />
            </label>

            {/* Upload Button */}
            <div
              className="text-center text-[13px] px-6 py-3 rounded-md font-bold bg-richblack-600 hover:cursor-pointer text-white hover:scale-90 transition-all duration-200 flex flex-row gap-2"
              onClick={handleUploadImage}
            >
              <CgSoftwareUpload size={20} />
              <p className="text-md">Upload</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information Section */}
      <div className="bg-richblack-800 border-2 border-richblack-500 flex flex-col items-center gap-5 py-3 rounded-md mb-8">
        <div className="flex flex-row w-full justify-between px-10">
          <p className="text-white text-xl">Profile Information</p>
          <div
            className="text-center text-[13px] px-6 py-3 rounded-md font-bold bg-yellow-50 text-black hover:scale-90 transition-all duration-200 inline-block"
            onClick={handleProfileSave}
          >
            Save
          </div>
        </div>
        <form className="w-full px-10">
          <div className="flex flex-row justify-evenly w-full mb-4">
            <div className="flex flex-col w-[40%]">
              <label className="text-white" htmlFor="firstname">
                First Name
              </label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Enter your First Name"
                value={profileFormData.firstname || user?.firstName || ""}
                onChange={handleProfileChange}
                className="border border-richblack-500 rounded-md p-2 mt-2 w-full text-white bg-richblack-700"
              />
            </div>
            <div className="flex flex-col w-[40%]">
              <label className="text-white" htmlFor="lastname">
                Last Name
              </label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Enter your Last Name"
                value={profileFormData.lastname || user?.lastName || ""}
                onChange={handleProfileChange}
                className="border border-richblack-500 rounded-md p-2 mt-2 w-full text-white bg-richblack-700"
              />
            </div>
          </div>
          <div className="flex flex-row justify-evenly w-full mb-4">
            <div className="flex flex-col w-[40%]">
              <label className="text-white" htmlFor="date">
                Date of Birth
              </label>
              <input
                name="date"
                id="date"
                type="date"
                value={profileFormData.date || userData?.dateOfBirth || ""}
                onChange={handleProfileChange}
                className="border border-richblack-500 rounded-md p-2 mt-2 w-full text-white bg-richblack-700"
              />
            </div>
            <div className="flex flex-col w-[40%]">
              <label className="text-white" htmlFor="gender">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={profileFormData.gender || userData?.gender || ""}
                onChange={handleProfileChange}
                className="border border-richblack-500 text-white rounded-md p-2 mt-2 w-full bg-richblack-700"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex flex-row justify-evenly w-full mb-4">
            <div className="flex flex-col w-[40%]">
              <label className="text-white" htmlFor="phoneno">
                Phone No.
              </label>
              <input
                type="number"
                id="phoneno"
                name="phoneno"
                value={profileFormData.phoneno || userData?.contactNumber || ""}
                placeholder="Enter your Mobile No."
                onChange={handleProfileChange}
                className="border border-richblack-500 rounded-md p-2 mt-2 w-full text-white bg-richblack-700"
              />
            </div>
            <div className="flex flex-col w-[40%]">
              <label className="text-white" htmlFor="about">
                About
              </label>
              <input
                id="about"
                name="about"
                value={profileFormData.about || userData?.about || ""}
                type="text"
                placeholder="Tell us about yourself"
                onChange={handleProfileChange}
                className="border border-richblack-500 rounded-md p-2 mt-2 w-full text-white bg-richblack-700"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="bg-richblack-800 border-2 border-richblack-500 flex flex-col items-center gap-5 py-3 rounded-md mb-8">
        <div className="flex flex-row w-full justify-between px-10">
          <p className="text-white text-xl">Change Password</p>
          <div
            className="text-center text-[13px] px-6 py-3 rounded-md  font-bold bg-yellow-50 text-black hover:scale-90 transition-all duration-200 inline-block"
            onClick={handlePasswordSave}
          >
            Save
          </div>
        </div>
        <form className="w-full px-10">
          <div className="flex flex-col justify-evenly w-full gap-5 mb-4">
            <label className="relative flex flex-col w-[40%]">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Old Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showoldpassword ? "text" : "password"}
                name="oldPassword" // Ensure this matches the key in your state
                value={passwordFormData.oldPassword || ""} // Provide a default value
                onChange={handlePasswordChange}
                placeholder="Enter your old Password"
                className="border text-white border-richblack-500 rounded-md p-2 mt-2 w-full bg-richblack-700"
              />
              <span
                onClick={() => setshowoldpassword((prev) => !prev)}
                className="absolute right-3 top-[45px] z-[10] cursor-pointer"
              >
                {showoldpassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

            <label className="relative flex flex-col w-[40%]">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Create Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={passwordFormData.password}
                onChange={handlePasswordChange}
                placeholder="Enter Password"
                className="border text-white border-richblack-500 rounded-md p-2 mt-2 w-full bg-richblack-700"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[45px] z-[10] cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>
            <label className="relative flex flex-col w-[40%]">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Confirm Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordFormData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm Password"
                className="border text-white border-richblack-500 rounded-md p-2 mt-2 w-full bg-richblack-700"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[43px] z-[10] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>
          </div>
        </form>
      </div>

      {/* Delete Account Section */}
      <div className="bg-pink-800 border-2 border-pink-800 flex flex-row items-center gap-7 py-3 rounded-md mb-8">
        <div className="ml-7 bg-pink-600 rounded-full p-2 text-pink-200">
          <RiDeleteBinLine size={30} />
        </div>
        <div className="flex flex-col">
          <p className="text-2xl font-semibold text-white">
            Delete Your Account
          </p>
          <p className="w-[50%] text-[#6e6e6e]">
            Are you sure? Once deleted, all your courses and other information
            will also be deleted.
          </p>
          <p
            onClick={() =>
              setVisibleModal({
                text1:"Are you Sure?",
                text2:"Once you click Delete, we can't recover your account.",
                btn1Handler: () => {
                  dispatch(deleteProfile(token, navigate));
                },
                btn2Handler: () => setVisibleModal(null),
                btn1text:"Delete",
                btn2text:"Cancel",
              })
            }
            className="hover:underline hover:cursor-pointer text-pink-200"
          >
            Delete My Account
          </p>
        </div>
      </div>

      {visibleModal && <Modal ModalData={visibleModal} />}
    </div>
  );
};

export default Setting;
