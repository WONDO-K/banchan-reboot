import React from "react";
import logo from "@assets/logo.png";
import google from "@assets/google_logo.png";
import { useNavigate } from "react-router-dom";
import KakaoLoginButton from "../components/oauthlogin/KakaoLoginButton"; // Import the KakaoLoginButton component

const FirstPage: React.FC = () => {
  const navigate = useNavigate();

  const gotoMain = () => {
    navigate("/m/home");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-white">
      <div className="mb-8 text-center">
        <img src={logo} alt="Kakao Logo" className="w-[361px] h-[230px] mr-2" />
      </div>
      <div className="w-80">
        {/* Replace the existing Kakao button with KakaoLoginButton */}
        <KakaoLoginButton />
        <button className="mt-4 flex items-center justify-center w-full mb-4 p-4 border border-black rounded-lg">
          <img src={google} alt="Google Logo" className="w-6 h-6 mr-2" />
          구글로 계속하기
        </button>
        <button
          onClick={gotoMain}
          className="mt-10 w-full p-4 bg-blue-500 text-white rounded-lg"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default FirstPage;
