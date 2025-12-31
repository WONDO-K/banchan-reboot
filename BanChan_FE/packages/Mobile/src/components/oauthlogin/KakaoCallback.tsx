import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cookies, setCookie] = useCookies(["Token"]);
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
        setCookie('Token',accessToken , {
          path: "/",
          expires: new Date(Date.now() + 604800000),
        })
        alert('카카오 로그인 성공')
        localStorage.setItem('accessToken', cookies.Token);
        localStorage.setItem('refreshToken', refreshToken);

        // 인증 후 홈으로 이동
        navigate('/m/home');
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
        alert('카카오 로그인에 실패하였습니다.')
        navigate('/m'); // 로그인 실패 시 로그인 페이지로 이동
      }
    };

    fetchToken();
  }, [navigate, searchParams]);

  return <div>Loading...</div>;
};

export default KakaoCallback;
