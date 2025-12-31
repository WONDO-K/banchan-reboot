import React from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import logo from '@assets/logo.png';
import { useCookies } from 'react-cookie';
import axios from 'axios';
interface SidebarItemProps {
  icon: string;
  text: string;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center w-full text-customSideBarTextColor focus:text-customBlue hover:text-customBlue hover:border-l-4 hover:border-customBlue ${
          isActive ? 'border-l-4 border-customBlue text-customBlue' : ''
        }`
      }
    >
      <span className="material-symbols-outlined text-[30px] pl-10">
        {icon}
      </span>
      <div className="mt-[2.8px] ml-2">
        <span className="ml-2 text-[18px]">{text}</span>
      </div>
    </NavLink>
  );
};

const MainSideBar: React.FC = () => {

  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(['Token']);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/token/logout`, {}, {
        headers: {
          Authorization: `Bearer ${cookies.Token}`, // Authorization 헤더 포함
        },
        withCredentials: true, // 쿠키 인증이 필요하면 사용
      });
      if (response.status === 200) {
        // 로그아웃 후 토큰 제거
        removeCookie('Token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // 로그아웃 후 페이지 이동
        alert('로그아웃 되었습니다.')
        navigate('/login');
      } else {
        throw new Error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout failed: ', error);
      alert('로그아웃에 실패했습니다.');
    }
  };



  return (
    <div className="w-64 bg-white shadow-lg border-r border-solid">
      <div className="">
        {/* 이미지는 절대 경로로 !!  */}
        <img
          src={logo}
          alt="반찬 로고"
          className="h-[100px] w-[160px] ml-6 my-6"
        />
        <nav className="space-y-12 text-center mt-20">
          <SidebarItem icon="home" text="메인페이지" to="/home" />
          <SidebarItem icon="Chat" text="커뮤니티" to="/community" />
          <SidebarItem
            icon="manage_accounts"
            text="이용자관리"
            to="/userManage"
          />
          <SidebarItem icon="how_to_vote" text="투표 관리" to="/vote" />
          <SidebarItem
            icon="video_camera_front"
            text="회의 관리"
            to="/meeting"
          />
          <SidebarItem icon="HandyMan" text="기타 관리" to="/others" />
        </nav>

        <div className="mt-[220px]"></div>
        <div onClick={handleLogout}>
        <SidebarItem icon="logout" text="로그아웃" to="/"/>
        </div>
        </div>
    </div>
  );
};

export default MainSideBar;
