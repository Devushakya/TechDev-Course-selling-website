
const BASE_URL = "http://localhost:4000/api/v1";
// console.log("dekh le", BASE_URL);

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/sendOTP",
  SIGNUP_API: BASE_URL + "/signup",
  LOGIN_API: BASE_URL + "/login",
  RESETPASSTOKEN_API: BASE_URL + "/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/getAllUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/instructorDashboard",
  GET_INSTRUCTOR_DASHBOARD_API: BASE_URL + "/instructorDashboard",
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/vertifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/sendPaymentSuccessEmail",
};

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/getCourseDetail",
  EDIT_COURSE_API: BASE_URL + "/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/showallCategorys",
  CREATE_COURSE_API: BASE_URL + "/createCourse",
  CREATE_SECTION_API: BASE_URL + "/createSection",
  CREATE_SUBSECTION_API: BASE_URL + "/createSubSection",
  UPDATE_SECTION_API: BASE_URL + "/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED: BASE_URL + "/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/createRating",
  CHANGE_STATE_API: BASE_URL + "/changeState",
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/getReviews",
};

// CATEGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/showallCategorys",
};

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/categoryPageDetails",
};

// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/contactUs",
};

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/changePassword",
  DELETE_PROFILE_API: BASE_URL + "/deleteAccount",
};
