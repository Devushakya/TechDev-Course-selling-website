import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Error from "./pages/Error";
import ContactUs from "./pages/ContactUs";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import MyProfile from "../src/components/core/dashboard/MyProfile";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Setting from "./components/core/dashboard/settings/Setting";
import EnrolledCourse from "./components/core/dashboard/EnrolledCourse/EnrolledCourse";
import Cart from "./components/core/dashboard/cart/Cart";
import { useSelector } from "react-redux";
import AddCourse from "./components/core/dashboard/AddCourse/AddCourse";
import MycourseMain from "./components/core/dashboard/Mycourse/MycourseMain";
import InstructorMain from "./components/core/dashboard/INstructorDashboard/InstructorMain";
import EditCourse from "./components/core/dashboard/EditCourse/EditCourse";
import CategoryMain from "./components/core/CategoryPage/CategoryMain";
import CoursePage from "./pages/CoursePage";
import ViewCourse from "./pages/ViewCourse";
import VideoPlayerPage from "./components/core/ViewCoursePage/VideoPlayerPage";

function App() {
  const { user } = useSelector((state) => state.profile);
  console.log(user);
  return (
    <div className=" bg-richblack-900 flex flex-col font-inter w-screen min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:token"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="catalog/:category" element={<CategoryMain />} />
        <Route path="*" element={<Error />} />
        <Route path="courses/:courseId" element={<CoursePage />} />
        {user?.accountType === "Student" && (
          <>
            <Route path="view-course/:courseId" element={<ViewCourse />} />
            <Route
              path="view-course/video/:secId"
              element={<VideoPlayerPage />}
            />
          </>
        )}

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Setting />} />

          {user?.accountType === "Student" && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourse />}
              />
              <Route path="dashboard/cart" element={<Cart />} />
            </>
          )}

          {user?.accountType === "Instructor" && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MycourseMain />} />
              <Route path="dashboard/instructor" element={<InstructorMain />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
