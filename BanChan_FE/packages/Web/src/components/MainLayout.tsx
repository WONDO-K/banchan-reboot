import React from "react";
import MainHeader from "./MainHeader";
import MainSideBar from "./MainSideBar";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = ( ) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 좌측 메뉴바 */}
        <MainSideBar/>
    <div className="flex-1 bg-customBackgroundColor">
      <div>
        {/* 상단 헤더 */}
      <MainHeader></MainHeader>
      {/* 출력물 */}
      <Outlet />  
      </div>
    </div>
  </div>
  );
};

export default MainLayout;
