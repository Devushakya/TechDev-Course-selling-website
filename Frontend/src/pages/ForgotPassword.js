import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { getpasswordResetToken } from "../services/operations/authAPI";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const { loading } = useSelector((state) => state.auth);
  const [emailsent, setemailsent] = useState(false);
  const [email, setemail] = useState("");
  const dispatch = useDispatch();

  const submitHandler= (e)=>{
    e.preventDefault();
    dispatch(getpasswordResetToken(email,setemailsent))

  }

  console.log("forgot");



  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="flex flex-row items-center justify-center h-screen   w-full">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <p className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            {" "}
            {emailsent ? "Check Mail" : "Reset your Password"}{" "}
          </p>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            {emailsent
              ? `we have sent you a reset email to ${email} `
              : "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"}
          </p>
          <form onSubmit={submitHandler}>
            {!emailsent && (
              <div>
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Email address <sup className=" text-pink-200">*</sup>{" "}
                </p>
                <input
                  type="email"
                  name="email"
                  className="form-style w-full bg-richblack-600  rounded-[8px]  py-[12px] px-[12px] font-medium text-white"
                  value={email}
                  placeholder="Enter Email Address"
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>
            )}

            <button className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900">
              {emailsent ? "Resend Email" : "Reset Password"}
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <MdOutlineKeyboardDoubleArrowLeft /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
