import React from "react";
import { useNavigate } from "react-router-dom";
import { LargeButtonProps } from "../../Type";

const LargeButton: React.FC<LargeButtonProps> = ({ title, to, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-customBlue text-white w-[130px] h-[50px] rounded-[20px]
"
    >
      {title}
    </button>
  );
};

export default LargeButton;
