import axios from 'axios';
import { Cookies } from 'react-cookie';
import apiClient from '../mobileapi/api';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const cookies = new Cookies();

// 카카오 로그인
export const handleKakaoLogin = async (code: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/auth/kakao/login`, { 
      params: { code }
    });
    const { accessToken, refreshToken } = response.data;

    // 토큰을 localStorage, 쿠키에 저장
    cookies.set("Token", accessToken, { path: '/' });
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // 로그인 성공 반환
    return true;
  } catch (error) {
    console.error('카카오 로그인 실패', error);

    // 로그인 실패 반환
    return false;
  }
};

// 자체 로그인
export const originLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/origin/login`, {
      email,
      password,
    });
    const { accessToken, refreshToken } = response.data;

    // 토큰을 localStorage에 저장
    cookies.set("Token", accessToken, { path: '/' });
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return true;
  } catch (error) {
    console.error('자체 로그인 실패', error);
    return false;
  }
};

// 토큰 재발급
export const reissueToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    console.error('No refresh token available');
    return null;
  }

  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/token/refresh`, { refreshToken });
    const { accessToken } = response.data;

    // 새 액세스 토큰 저장
    cookies.set("Token", accessToken, { path: '/' });
    localStorage.setItem('accessToken', accessToken);

    return accessToken;
  } catch (error) {
    console.error('Failed to reissue access token', error);
    return null;
  }
};

// 로그아웃
export const logout = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('Access token not found');
    }

    // 서버에 로그아웃 요청을 보냄
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/token/logout`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true, // 쿠키 인증이 필요하면 사용
    });

    // 모든 쿠키를 삭제하는 함수
    const deleteAllCookies = () => {
      const cookies = document.cookie.split(';');

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.i11e105.p.ssafy.io';
      }
    };

    // 쿠키와 로컬 스토리지에서 토큰 제거
    deleteAllCookies();
    localStorage.clear();

    // 로그아웃 후 페이지 이동
    window.location.href = '/m'; // 로그인 페이지로 리다이렉트
  } catch (error) {
    console.error('Logout failed: ', error);
    alert('로그아웃에 실패했습니다.');
  }
};


// 내 정보 초기 설정
export const setMyInfo = async (info: { name: string; phone: string }) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/user/setmyinfo`, info);
    return response.data;
  } catch (error) {
    console.error('내 정보 초기 설정 실패', error);
    throw error;
  }
};

// 아파트 정보 초기 설정
export const setMyAptInfo = async (aptInfo: { aptName: string; aptNumber: string }) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/user/setmyapt`, aptInfo);
    return response.data;
  } catch (error) {
    console.error('아파트 정보 초기 설정 실패', error);
    throw error;
  }
};

// 내 정보 조회
export const getMyInfo = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/user/myinfo`);
    return response.data;
  } catch (error) {
    console.error('내 정보 조회 실패', error);
    throw error;
  }
};

// 전화번호 중복 확인
export const checkPhoneNumber = async (phone: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/user/check/phone`, {
      params: { phone },
    });
    return response.data;
  } catch (error) {
    console.error('전화번호 중복 확인 실패', error);
    throw error;
  }
};

// 사용자 정보 업데이트
export const updateUser = async (email: string, newPassword: string) => {
  try {
    const response = await apiClient.put('/api/user/update', {
      email,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};
