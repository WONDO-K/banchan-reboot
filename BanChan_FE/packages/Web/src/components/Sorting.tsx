// import React from "react";

const Sorting = () => {
  return (
    <div className="flex justify-center items-center mr-6 bg-white p-2 rounded-[16px] shadow-md">
      <button
        className={`flex-1 flex justify-center items-center py-2 px-4 rounded-l-lg `}
      >
        작성일
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4 ml-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="border-l border-gray-300"></div>
      <button
        className={`flex-1 flex justify-center items-center py-2 px-4 rounded-r-lg`}
      >
        추천수
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4 ml-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Sorting;
