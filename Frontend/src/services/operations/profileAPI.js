import { toast } from "react-hot-toast";

import { setData, setLoading, setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnect";
import { profileEndpoints } from "../apis";
import { logout } from "./authAPI";
import { useDispatch } from "react-redux";

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
  GET_INSTRUCTOR_DASHBOARD_API,
} = profileEndpoints;

export const getUserDetails = (token) => async (dispatch) => {
  let result = null;
  try {
    console.log("Inside getUserDetails");
    if (!token) {
      throw new Error("Token is missing or invalid");
    }

    const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log("Full API Response:", response);

    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || "Failed to fetch user details");
    }

    result = response.data; // Set result to response data

    // Optionally dispatch an action with the user details
    dispatch({ type: "FETCH_USER_DETAILS_SUCCESS", payload: result });
  } catch (error) {
    console.error("Get user detail API ERROR............", error);
    dispatch({ type: "FETCH_USER_DETAILS_FAILURE", error: error.message });
  }

  console.log("Returning result:", result);
  return result; // Return the result
};

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
    // console.log("result", result);
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
    toast.error("Could Not Get Enrolled Courses");
  }
  toast.dismiss(toastId);
  return result;
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log("GET_INSTRUCTOR_API_RESPONSE", response);
    result = response?.data?.courses;
  } catch (error) {
    console.log("GET_INSTRUCTOR_API ERROR", error);
    toast.error("Could not Get Instructor Data");
  }
  toast.dismiss(toastId);
  return result;
}

export async function instructorDashboard(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_INSTRUCTOR_DASHBOARD_API,
      null,
      {
        Authorization: ` Bearer ${token}`,
      }
    );

    console.log("GET INSRUCTOR DASHBOARD RESPONCE:", response);
    result = response?.data;
  } catch (error) {
    console.log("GET INSRUCTOR DASHBOARD RESPONCE:", error);
    toast.error("Could not Get Instructor dashboard Data");
  }
  toast.dismiss(toastId);
  return result;
}
