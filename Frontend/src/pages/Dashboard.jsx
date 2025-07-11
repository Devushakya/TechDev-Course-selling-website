import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/dashboard/Sidebar";
import { FaChevronRight } from "react-icons/fa";

const Dashboard = () => {
  const { loading: AuthLoading } = useSelector((state) => state.auth);
  const { loading: ProfileLoading } = useSelector((state) => state.profile);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (ProfileLoading || AuthLoading) {
    return (
      <div className="flex flex-row items-center justify-center h-screen w-full">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      {/* Slide-in Button - just below navbar */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-[3.6rem] left-2 z-50 text-white bg-richblack-800 p-2 rounded-md shadow-lg"
        >
          <FaChevronRight size={20} />
        </button>
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
