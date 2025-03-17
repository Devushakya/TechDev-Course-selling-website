import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Bar, Line, PolarArea ,Pie} from "react-chartjs-2";

const ChartData = ({ visualize, visualizeHandle, courses }) => {
  // Fallback data for testing
  const data = {
    labels: ["Red", "Green", "Yellow", "Grey", "Blue"],
    datasets: [
      {
        label: "My First Dataset",
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(255, 205, 86)",
          "rgb(201, 203, 207)",
          "rgb(54, 162, 235)",
        ],
      },
    ],
  };

  const chartColors = [
    "rgb(255, 99, 132)", // Red
    "rgb(75, 192, 192)", // Teal
    "rgb(255, 205, 86)", // Yellow
    "rgb(201, 203, 207)", // Gray
    "rgb(54, 162, 235)", // Blue
    "rgb(153, 102, 255)", // Purple
    "rgb(255, 159, 64)", // Orange
    "rgb(101, 143, 255)", // Sky Blue
    "rgb(255, 132, 203)", // Pink
    "rgb(103, 230, 220)", // Cyan
    "rgb(244, 114, 182)", // Magenta
    "rgb(230, 176, 170)", // Peach
    "rgb(124, 252, 0)", // Lime Green
    "rgb(250, 128, 114)", // Salmon
    "rgb(238, 130, 238)", // Violet
  ];

  const StudentData = {
    labels: courses?.map((course) => course.courseName),
    datasets: [
      {
        data: courses?.map((course) => course.totalStudentsEnrolled),
        backgroundColor: chartColors.slice(0, courses?.length),
      },
    ],
  };
  const IncomeData = {
    labels: courses?.map((course) => course.courseName),
    datasets: [
      {
        data: courses?.map((course) => course.totalAmountGenerated),
        backgroundColor: chartColors.slice(0, courses?.length),
      },
    ],
  };

  // Debugging Logs
  console.log("Visualize:", visualize);
  //   console.log("FallbackData:", fallbackData);
  ChartJS.register(ArcElement, Tooltip, Legend);

  return (
    <div className="bg-richblack-800 basis-1/2 p-6 rounded-2xl border-2 border-richblack-700 flex flex-col gap-4">
      <p className="text-xl font-semibold text-white">Visualize</p>
      <div className="flex flex-row gap-3 text-white">
        <button
          onClick={() => visualizeHandle("Students")}
          className={`hover:bg-richblack-500  px-4 py-2 rounded-md ${
            visualize === "Students"
              ? "bg-yellow-200 hover:bg-yellow-300 text-black "
              : "bg-richblack-600 hover:bg-richblack-500 text-white "
          }`}
        >
          Students
        </button>
        <button
          onClick={() => visualizeHandle("Income")}
          className={`  px-4 py-2 rounded-md ${
            visualize === "Income"
              ? "bg-yellow-200 hover:bg-yellow-300 text-black "
              : "bg-richblack-600 hover:bg-richblack-500 text-white "
          }`}
        >
          Income
        </button>
      </div>

      {/* Chart */}
      <div className="relative h-96">
        <Doughnut data={visualize === "Students" ? StudentData : IncomeData} />
      </div>
    </div>
  );
};

export default ChartData;
