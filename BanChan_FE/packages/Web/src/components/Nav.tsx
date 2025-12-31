import React from "react";
import { NavProps } from "../Type";

const Nav: React.FC<NavProps> = ({ children }) => {
  return (
    <div className="nav-elements w-full flex justify-center mt-4">
      <div className="relative w-full max-w-[1500px] px-2">
        <div className="absolute inset-x-0 bottom-0 border-b-2 border-customLineColor"></div>
        <ul className="relative flex pt-6 ml-10">{children}</ul>
      </div>
    </div>
  );
};

export default Nav;
