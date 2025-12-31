import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleKakaoLogin } from '../api/auth';

const KakaoRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('로그인 처리 중...');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (code) {
      handleKakaoLogin(code)
        .then((success) => {
          if (success) {
            setStatus('로그인에 성공했습니다. 추가 정보를 입력하세요.');
            setTimeout(() => {
              navigate('/user-manage/detail');
            }, 1000);
          } else {
            setStatus('로그인에 실패했습니다. 다시 시도해주세요.');
            setTimeout(() => {
              navigate('/');
            }, 3000);
          }
        })
        .catch(() => {
          setStatus('로그인에 실패했습니다. 다시 시도해주세요.');
          setTimeout(() => {
            navigate('/');
          }, 3000);
        });
    } else {
      setStatus('로그인에 실패했습니다. 다시 시도해주세요.');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div>{status}</div>
    </div>
  );
};

export default KakaoRedirect;
