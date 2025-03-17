import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className=" font-bold bg-gradient-to-t from-[#84fab0] to-[#8fd3f4] text-transparent  bg-clip-text">
      {text}
    </span>
  );
}

export default HighlightText
