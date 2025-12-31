import React from 'react';
import {Outlet } from "react-router-dom";

const UserManagePage: React.FC = () => {

  return (
        <>
        <Outlet />
        </>
  );
};

export default UserManagePage;
