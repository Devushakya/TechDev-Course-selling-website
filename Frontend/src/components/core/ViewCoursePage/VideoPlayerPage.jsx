import React from "react";
import { useLocation } from "react-router-dom";
import ReactPlayer from "react-player";


const VideoPlayerPage = () => {
  const location = useLocation();
  const SubsecData = location.state?.secdata;
  console.log("subsecdata",SubsecData);

  if (!SubsecData) {
    return (
      <p className="text-center text-red-500 font-semibold">
        No video data available
      </p>
    );
  }

  const showDuration = ()=>{
  let totalDurationInSeconds = SubsecData?.timeDuration;

  const hours = Math.floor(totalDurationInSeconds / 3600);
  const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
  const seconds = Math.floor(totalDurationInSeconds % 60);

  let formattedDuration = [];
  if (hours > 0) formattedDuration.push(`${hours} hr`);
  if (minutes > 0) formattedDuration.push(`${minutes} min`);
  if (seconds > 0 || formattedDuration.length === 0)
    formattedDuration.push(`${seconds} sec`);

  return formattedDuration.join(" ");
}

  

  return (
    <div className="max-w-4xl text-white mx-auto p-4">
      <div className="w-full flex justify-center">
        <ReactPlayer
          url={SubsecData.videoUrl}
          controls
          width="100%"
          height="500px"
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
              },
            },
          }}
        />
      </div>
      <h2 className="text-2xl text-yellow-200 font-bold  mb-4">
        {SubsecData.title}
      </h2>
      <p className="text-lg text-gray-700 mt-4">{SubsecData.description}</p>
      <p className="text-sm text-gray-500 mt-2">
        Duration: <span className="text-yellow-200">{showDuration()} </span>
      </p>
    </div>
  );
};

export default VideoPlayerPage;
