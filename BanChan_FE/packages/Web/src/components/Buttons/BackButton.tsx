import React from "react";
import { useNavigate } from "react-router-dom";


const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <button
        type="button"
      onClick={handleClick}
      className=" flex items-center rounded-full bg-blue-300 text-white px-4 py-2 mx-2 hover:bg-blue-700 transition duration-300" >    
      <span className="m-0 text-xl">&lt;</span>
      </button>
  );
};

export default BackButton;
