import React from "react";

const MainHeader: React.FC = () => {
  return (
    <div className="w-full border-solid border-b-2 px-6 bg-white border-l">
      <div className="pt-6">
        <header className="flex items-center justify-end mb-6 ">
          <div className="flex items-center space-x-4 mr-6  ">
            <span className="text-gray-500 mr-6 font-semibold text-[18px]">
              주소: 부산광역시 강서구 삼정그린코아 더시티
            </span>
          </div>
        </header>
      </div>
    </div>
  );
};

export default MainHeader;
