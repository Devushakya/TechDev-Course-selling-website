export default function calculateTotalCourseDuration(course) {
  let totalDurationInSeconds = 0;

  course?.courseContent.forEach((section) => {
    section?.SubSection.forEach((subSection) => {
      totalDurationInSeconds += parseFloat(subSection.timeDuration);
    });
  });

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
