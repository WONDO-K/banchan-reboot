import React, { useState } from "react";
import { HeaderProps, SidebarItemProps } from "../Types";
import { NavLink } from "react-router-dom";
import useCustomNavigation from "../hooks/useCustomNavigation";

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  to,
  children,
}) => {
  return (
    <div>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center w-full text-black focus:text-customBlue hover:text-customBlue hover:border-l-4 hover:border-customBlue ${
            isActive ? "border-l-4 border-customBlue text-customBlue" : ""
          }`
        }
      >
        <span className="material-symbols-outlined text-[30px] pl-10">
          {icon}
        </span>
        <div className="mt-[2.8px] ml-2 ">
          <span className="ml-2 text-[18px]">{text}</span>
        </div>
      </NavLink>
      {children && (
        <div className="ml-5 mt-6 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { goBack } = useCustomNavigation();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBackButtonClick = () => {
    goBack();
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-blue-500 relative">
      <button className="text-white" onClick={handleBackButtonClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h2 className="text-xl font-bold text-white">{children}</h2>
      <div className="relative">
        <button
          onClick={handleMenuToggle}
          className="text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {menuOpen && (
          <div
            className="absolute right-[-16px] mt-2 w-[200px] bg-white border rounded shadow-lg 
               text-center h-[663px] transition-transform duration-700 transform z-50"
          >
            <div className="mt-[60px]"></div>
            <SidebarItem
              icon="home"
              text="홈"
              to="/m/home"
            />

            <div className="mt-[60px]"></div>
            <SidebarItem icon="person" text="마이페이지" to="/m/mypage" />
            <div className="mt-[30px]"></div>

            <SidebarItem
              icon="forum"
              text="커뮤니티"
              to="/m/community/"
            >
              <SidebarItem
                icon="assignment"
                text="공지사항"
                to="/m/community/notice/list"
              />
              <SidebarItem
                icon="person_raised_hand"
                text="건의함"
                to="/m/community/ask/list"
              />
            </SidebarItem>

            <div className="mt-[30px]"></div>

            <SidebarItem icon="how_to_vote" text="투표" to="/m/vote" />
            <div className="mt-[40px]"></div>

            <SidebarItem
              icon="calendar_today"
              text="회의"
              to="/m/meetingList"
            />
            <div className="mt-[100px]"></div>
            <SidebarItem icon="logout" text="로그아웃" to="/m" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;