import React from "react";
import { SmallButtonProps } from "../../Type";

const SmallButton: React.FC<SmallButtonProps> = ({
  title = "",
  bgColor = "",
  txtColor = "",
  borderColor = "",
  onClick,
}) => {
  return (
    <button
      className={`${bgColor} ${txtColor} ${borderColor} w-[120px] h-[35px] rounded-[20px] border-2 shadow-custom`}
      onClick={onClick} // onClick 핸들러 연결
    >
      {title}
    </button>
  );
};

export default SmallButton;
