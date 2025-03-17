import React from "react";

const HighlightText = ({ text, type }) => {
  let gradientClass = "";

  if (type === 1) {
    gradientClass = "bg-gradient-to-t from-[#84fab0] to-[#8fd3f4]";
  } else if (type === 2) {
    gradientClass = "bg-gradient-to-t from-[#43e97b] to-[#38f9d7]";
  } else if (type === 3) {
    gradientClass = "bg-gradient-to-t from-[#fa709a] to-[#fee140]";
  } else {
    gradientClass = "bg-gradient-to-t from-[#4facfe] to-[#00f2fe]";
  }

  return (
    <span
      className={`${gradientClass} font-bold text-transparent bg-clip-text`}
    >
      {text}
    </span>
  );
};

export default HighlightText;
