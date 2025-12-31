import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) {
          throw new Error('카카오 인증 코드가 없습니다.');
        }


        // 백엔드에 카카오 코드 전달하여 JWT 토큰 받기
        const response = await axios.get(`${BACKEND_URL}/api/auth/kakao/login`, { 
          params: { code }
        });
        const { accessToken, refreshToken } = response.data;

        // 토큰을 localStorage에 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // 인증 후 홈으로 이동
        navigate('/home');
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
        navigate('/login'); // 로그인 실패 시 로그인 페이지로 이동
      }
    };

    fetchToken();
  }, [navigate, searchParams]);

  return <div>Loading...</div>;
};

export default KakaoCallback;
