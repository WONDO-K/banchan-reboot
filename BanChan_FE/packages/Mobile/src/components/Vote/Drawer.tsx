import React, { useState } from "react";
import { DrawerProps } from "../../Types";

const Drawer: React.FC<DrawerProps> = ({ title, items }) => {
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
        {items.map((item, index) => (
          <div
            className="py-4 border border-black rounded-2xl mt-4"
            key={index}
          >
            <div className="p-3">
              <h4 className="text-lg font-bold">{item.title}</h4>
              <p className="text-gray-600">{item.date}</p>
              <div className="mt-4 flex items-center space-x-2">
                <button
                  onClick={item.onClick}
                  className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600"
                >
                  {item.buttonText}
                </button>
                <button className="py-2 px-4 bg-gray-200 text-blue-500 font-semibold rounded-full">
                  {item.statusText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drawer;
