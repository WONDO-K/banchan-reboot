import React, { useState } from "react";
import CalendarApp from "./CalendarApp";
import { CalendarDrawerProps } from "../../Types";

const CalendarDrawer: React.FC<CalendarDrawerProps> = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="px-4 py-2">
      <h3
        className="mt-4 text-xl font-bold flex items-center justify-between cursor-pointer"
        onClick={toggleDrawer}
      >
        {title}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`w-6 h-6 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </h3>
      <hr className="my-2 border-black" />
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <CalendarApp />
      </div>
    </div>
  );
};

export default CalendarDrawer;
