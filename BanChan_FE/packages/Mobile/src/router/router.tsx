import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FirstPage from "../pages/FirstPage";
import Home from "../pages/Home";
import HomeInfo from "../components/UserSettings/HomeInfo";
import MyPage from "../pages/MyPage";
import ShowVote from "../components/Vote/ShowVote";
import VoteList from "../components/Vote/VoteList";
import VoteResult from "../components/Vote/VoteResult";
import FinishedVote from "../components/Vote/FinishedVote";
import MeetingList from "../components/Meeting/MeetingList";
import CalendarApp from "../components/Meeting/CalendarApp";
import NoticeList from "../components/Community/Notice/NoticeList";
import NoticeDetail from "../components/Community/Notice/NoticeDetail";
import AskList from "../components/Community/Ask/AskList";
import AskWrite from "../components/Community/Ask/AskWrite";
import KakaoCallback from "../components/oauthlogin/KakaoCallback"; // KakaoCallback 컴포넌트 임포트
import SessionJoinPage from "../components/Meeting/SessionJoinPage";
import AskDetail from "../components/Community/Ask/AskDetail";
import Test from "../components/Meeting/Test";
import MeetingHome from "../components/Meeting/MeetingHome";

const router: React.FC = () => {
  return (
    <Routes>
      <Route path="/m/" element={<FirstPage />} />
      <Route path="/m/home" element={<Home />} />
      <Route path="/m/homeInfo" element={<HomeInfo />} />
      <Route path="/m/mypage" element={<MyPage />} />
      <Route path="/m/vote">
        <Route index element={<Navigate to="voteList" />} />
        <Route path="showVote/:id" element={<ShowVote />} />
        <Route path="voteList" element={<VoteList />} />
        <Route path="voteResult/:id" element={<VoteResult />} />
        <Route path="finishedVote/:id" element={<FinishedVote />} />
      </Route>
      <Route path="/m/meetingList" element={<MeetingList />} />
      <Route path="/m/calendar" element={<CalendarApp />} />
      <Route path="/m/meetingHome/:id" element={<MeetingHome />} />
      <Route path="/m/joinSession/:id" element={<MeetingHome />} />
      <Route path="/m/test" element={<Test />} />
      <Route path="/m/sessionJoin/:sessionId" element={<SessionJoinPage />} />
      <Route path="/m/community">
        <Route index element={<Navigate to="notice/list" />} />
        <Route path="notice/list" element={<NoticeList />} />
        <Route path="notice/detail/:id" element={<NoticeDetail />} />
        <Route path="ask/detail/:id" element={<AskDetail />} />
        <Route path="ask/list" element={<AskList />} />
        <Route path="ask/write" element={<AskWrite />} />
      </Route>
      <Route path="/m/homeInfo" element={<HomeInfo />} />
      <Route
        path="/m/login/oauth2/code/kakao"
        element={<KakaoCallback />}
      />{" "}
      {/* 콜백 경로 추가 */}
    </Routes>
  );
};

export default router;
