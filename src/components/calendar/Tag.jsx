import React from "react";

const Tag = ({ title, onClick, selected }) => {
  return (
    <div
      onClick={onClick}
      className={`px-2 py-1 border-3 rounded bg-blue-100 whitespace-nowrap hover:cursor-pointer m-2 ${
        selected && "bg-blue-300"
      }`}
    >
      {title}
    </div>
  );
};

export default Tag;
