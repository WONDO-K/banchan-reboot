import React from 'react';
import {Outlet } from "react-router-dom";

const MyPage: React.FC = () => {

  return (
        <>
        <Outlet />
        </>
  );
};

export default MyPage;
