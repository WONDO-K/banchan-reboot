import React from "react";
import { NavLink } from "react-router-dom";
import { NavItemProps } from "../Type";

const NavItem: React.FC<NavItemProps> = ({ to, label }) => {
  return (
    <li className=" mr-20 flex items-center justify-center  border-transparent">
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? "text-customFocusedTextColor border-customBlue border-b-4 pb-2"
            : "text-customTextColor pb-2"
        }
      >
        {label}
      </NavLink>
    </li>
  );
};

export default NavItem;
