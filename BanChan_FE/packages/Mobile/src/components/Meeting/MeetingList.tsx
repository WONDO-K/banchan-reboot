import React, { useEffect, useState } from "react";
import Drawer from "../Vote/Drawer";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { Items, Meeting } from "../../Types";
import CalendarDrawer from "./CalendarDrawer";
import { useCookies } from "react-cookie";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API_URL;

const MeetingList: React.FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const [completedMeetings, setCompletedMeetings] = useState<Items[]>([]);

  useEffect(() => {
    const fetchCompletedMeetings = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/session/get/roomList`,
          {
            headers: {
              Authorization: `Bearer ${cookies.Token}`,
            },
          }
        );

        // API 응답 데이터를 가공하여 state에 저장합니다.
        if (Array.isArray(response.data.data)) {
          setCompletedMeetings(
            response.data.data.map((meeting: Meeting) => ({
              title: meeting.roomName,
              date: meeting.startDate,
              buttonText: "요약본 확인",
              statusText: `회의 참여 인원: ${4}명`,
            }))
          );
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch completed meetings:", error);
      }
    };

    fetchCompletedMeetings();
  }, [cookies.Token]);

  // const completedItems = [
  //   {
  //     title: "LH 7월 3주차 회의",
  //     date: "07.15 19:00 ~ ",
  //     buttonText: "요약본 확인",
  //     statusText: "회의 참여 인원: 30명",
  //   },
  //   {
  //     title: "LH 5월 3주차 회의",
  //     date: "05.15 19:00 ~ ",
  //     buttonText: "요약본 확인",
  //     statusText: "회의 참여 인원: 30명",
  //   },
  // ];

  const handleResultClick = (item: Items) => {
    navigate("/m/community/notice/list", { state: { item } });
  };
  // const handleResultClick = (item: Items) => {
  //   navigate("/m/community/notice/list", { state: { item } });
  // };
  return (
    <div className="min-h-screen ">
      {/* 상단 네비게이션 */}
      <Header>나의 회의</Header>
      {/* 예정된 회의 */}
      <CalendarDrawer title="예정된 회의" />
      {/* 완료된 회의 */}
      <Drawer
        title="완료된 회의"
        items={completedMeetings.map((item) => ({
          ...item,
          onClick: () => handleResultClick(item),
        }))}
      />
    </div>
  );
};

export default MeetingList;
