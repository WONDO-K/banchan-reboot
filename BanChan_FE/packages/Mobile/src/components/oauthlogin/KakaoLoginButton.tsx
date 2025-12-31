import React from 'react';
import kakao from "@assets/kakao_logo.png"

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_M_KAKAO_REDIRECT_URI;
const KakaoLoginButton: React.FC = () => {
  const handleKakaoLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`;
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className="bg-yellow-400 text-black py-4 px-6 rounded-lg flex items-center justify-center w-full mb-4"  // 버튼 크기 조정
    >
      <div className="flex items-center justify-center">
        <img
          src={kakao}
          alt="KakaoTalk"
          className="w-6 h-6 mr-2"  // 이미지 크기 유지
        />
        <span className="text-center">카카오로 계속하기</span>
      </div>
    </button>
  );
};

export default KakaoLoginButton;
