// import React, { useEffect, useState } from "react";
// import bgImage from "@assets/Mobile_main.jpg";
// import { NavLink, useNavigate } from "react-router-dom";
// import axios from "axios";
import React,{useEffect, useState} from "react";
import bgImage from "@assets/Mobile_main.jpg";
import { useCookies } from "react-cookie";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { CommunityParamsType } from "../Types";
import { getCommunityList } from "../mobileapi/CommunityAPI";
const items = [
  { icon: "person", text: "마이페이지", to: "/m/mypage" },
  { icon: "forum", text: "커뮤니티", to: "/m/community" },
  { icon: "how_to_vote", text: "투표", to: "/m/vote" },
  { icon: "calendar_today", text: "회의", to: "/m/meetingList" },
];


const Home: React.FC = () => {
  // const [userInfo, setUserInfo] = useState(null);
  const [announcements,setNotice] = useState( [
    {
      id:1,
      title: "[공지] 모라 LH 7월 3주차 투표 결과 공지",
      createdAt: "2024.07.17",
    },
    {
      id:2,
      title: "[공지] 단지 내 공사 관련 공지",
      createdAt: "2024.06.28",
    },
  ])
  const [userAPT,setUserAPT] = useState(0)
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const params:CommunityParamsType = {
    keyword:'',
    sortBy:'createdAt',
    sortDirection:'desc',
    page:0,
    size:2
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/myinfo`, {
          headers: {
            Authorization: `Bearer ${cookies.Token}`, // 쿠키에서 토큰 사용
          },
        })
        setUserAPT(response.data.userApartments.length)
        const Board = await getCommunityList(cookies.Token,'api/notice/list',params);
        console.log(Board)
        setNotice(Board.content)
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    }
    fetchUserInfo();
  }, [cookies.Token]);

  const gotoHomeInfo = () => {
    console.log(announcements)
    navigate("/m/homeInfo");
  };
  // const hasUserApartments =
  //   userInfo.userApartments && userInfo.userApartments.length > 0;

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="relative w-[360px] h-[450px]">
        <img
          src={bgImage}
          alt="Mobile Main"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full flex justify-center">
          <span className="text-white text-2xl font-bold">반상회 CHANnel</span>
        </div>
      </div>

      <div className="relative w-[320px] h-[120px] mt-[-50px] flex bg-[#F0F8FF] border rounded-[20px] justify-center items-center z-10">
        {items.map((item) => (
          <NavLink
            key={item.text}
            to={item.to}
            className="flex flex-col items-center mx-3 text-blue-600"
          >
            <span className="material-symbols-outlined text-[40px] mb-[10px]">
              {item.icon}
            </span>
            <span className="mt-2 text-[14px] font-semibold text-black">
              {item.text}
            </span>
          </NavLink>
        ))}
      </div>

      <div className="relative w-[320px] h-[160px] mt-[30px] flex flex-col bg-[#F0F8FF] border rounded-[20px] justify-center items-center z-10 font-semibold">
        {/* {hasUserApartments && userInfo.userApartments[0].granted ? ( */}
        {userAPT == 0 ? (
          <>
            <div>세대 정보 기입 이후 정상 이용이 가능합니다. </div>
            <button
              onClick={gotoHomeInfo}
              className="w-[250px] mt-[30px] h-[60px] border rounded-2xl text-white bg-blue-600"
            >
              세대 정보 추가
            </button>
          </>
        ) : (
          <>
            <div className="relative w-[320px] p-4 bg-[#F0F8FF] border rounded-[10px]">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">공지사항</span>
                <NavLink to="/m/community/notice" className="text-gray-500">
                  더보기
                </NavLink>
              </div>
              {announcements.map((announcement) => (
                <NavLink to={`/m/community/notice/detail/${announcement.id}`}>

                <div key={announcement.id} className="mb-2">
                  <div className="font-semibold text-black">
                    {announcement.title}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {announcement.createdAt}
                  </div>
                </div>
                </NavLink>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

// import React from "react";

// const Home: React.FC = () => {
//   return <div>Home</div>;
// };

// export default Home;
