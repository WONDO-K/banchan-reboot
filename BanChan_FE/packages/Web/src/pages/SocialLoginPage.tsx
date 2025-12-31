// import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "@assets/logo.png";
// import kakao from "@assets/kakao_logo.png";
import google from "@assets/google_logo.png";
import KakaoLoginButton from "../components/Buttons/KakaoLoginButton"; // KakaoLoginButton 컴포넌트 임포트

const SocialLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center bg-cover bg-center h-screen bg-custom-background bg-white">
      <div className="bg-white rounded-xl shadow-lg p-32 text-center border-solid border-2 bg-opacity-90 ">
        <div className="mb-8">
          <div className="relative">
            <div>
              <img src={logo} alt="logo" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <KakaoLoginButton />

          <button className="bg-white text-black border border-gray-300 py-3.5 px-20 rounded-2xl flex items-center justify-center mx-4">
            <div className="w-[200px] flex items-center justify-center">
              <img src={google} alt="Google" className="w-6 h-6 mr-2" />
              <span className="text-center">구글로 계속하기</span>
            </div>
          </button>

          <button
            onClick={handleLogin}
            className="bg-customBlue text-white border border-gray-300  py-3.5 px-20 rounded-2xl flex items-center justify-center "
          >
            <div className="w-[200px] flex items-center justify-center">
              <span className="text-center">관리자로 로그인 하기</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginPage;
