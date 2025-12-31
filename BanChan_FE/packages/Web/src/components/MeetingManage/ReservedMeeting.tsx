import LargeButton from "../Buttons/LargeButton";
import Table from "../Table";
import SmallButton from "../Buttons/SmallButton";
import Nav from "../Nav";
import NavItem from "../NavItem";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Meeting } from "../../Type";
import { useCookies } from "react-cookie";

const baseUrl = import.meta.env.VITE_BASE_API_URL;

const NavElements = () => {
  return (
    <Nav>
      <NavItem to="/meeting/reservedMeeting" label="예약된 회의" />
      <NavItem to="/meeting/finishedMeeting" label="종료된 회의" />
    </Nav>
  );
};

const ReservedMeeting: React.FC = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [cookies] = useCookies();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/session/get/roomList`,
          {
            headers: {
              Authorization: `Bearer ${cookies.Token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data.data)) {
          setMeetings(response.data.data);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, [cookies]);

  const createSession = async (
    meetingId: number
  ): Promise<{ sessionId: string; token: string }> => {
    const response = await axios.post(
      `${baseUrl}/api/session/${meetingId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.Token}`,

          // Authorization: "Basic " + btoa("OPENVIDUAPP:YOUR_SECRET"),
        },
      }
    );

    const sessionId = response.data;
    const tokenResponse = await axios.post(
      `${baseUrl}/api/session/${sessionId}/token`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.Token}`,
        },
      }
    );

    const token = tokenResponse.data;

    return { sessionId, token };
  };

  const handleActivateMeeting = async (meeting: Meeting) => {
    const { sessionId, token } = await createSession(meeting.id);
    navigate(`/meetingPage/${sessionId}`, {
      state: {
        token,
        sessionId,
        roomName: meeting.roomName,
        startDate: meeting.startDate,
        startTime: meeting.startTime,
        active: meeting.active,
      },
    });
  };

  const startMeeting = (meeting: Meeting) => {
    return (
      <SmallButton
        title="회의 활성화"
        bgColor="bg-white"
        txtColor=""
        borderColor="border-customGreen"
        onClick={() => handleActivateMeeting(meeting)}
      />
    );
  };

  const sendNoti = (meeting: Meeting) => {
    return (
      <SmallButton
        title="알림 보내기"
        bgColor="bg-white"
        txtColor=""
        borderColor="border-customYellow"
        onClick={() =>
          console.log(`Sending notification for meeting ID: ${meeting.id}`)
        }
      />
    );
  };

  const headers = ["번호", "제목", "주최자", "회의 예정시각", "활성화", "알림"];

  const data = meetings
    .filter((meeting) => !meeting.active && meeting.session == null)
    .map((meeting, index) => [
      index + 1,
      meeting.roomName,
      "관리자",
      `${meeting.startDate} ${meeting.startTime}`,
      startMeeting(meeting),
      sendNoti(meeting),
    ]);

  return (
    <>
      <NavElements />
      <div className="container mx-auto p-4 mt-3">
        <div className="flex justify-end items-center mb-6 mr-6">
          <Link to="/meeting/createMeeting">
            <LargeButton title="회의 생성" />
          </Link>
        </div>
        <Table headers={headers} data={data} />
      </div>
    </>
  );
};

export default ReservedMeeting;
