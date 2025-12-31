import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SocialLoginPage from "../pages/SocialLoginPage";
import LoginPage from "../pages/LoginPage";
import Notice from "../components/Community/Notice";
import Ask from "../components/Community/Ask";
import ReservedMeeting from "../components/MeetingManage/ReservedMeeting";
import FinishedMeeting from "../components/MeetingManage/FinishedMeeting";
import Approval from "../components/UserManage/Approval";
import Manage from "../components/UserManage/Manage";
import Write from "../components/CRUD/Write";
import Detail from "../components/CRUD/Detail";
import Update from "../components/CRUD/Update";
import MeetingPage from "../pages/MeetingPage";
import VoteManagePage from "../pages/VoteManagePage";
import MainLayout from "../components/MainLayout";
import VoteCreatePage from "../components/VoteManage/VoteCreate";
import VoteDetail from "../components/VoteManage/VoteDetail";
import ActiveVote from "../components/VoteManage/ActiveVote";
import FinishedVote from "../components/VoteManage/FinishedVote";
import SendMessage from "../components/SendMessage";
import CommunityPage from "../pages/CommunityPage";
import MeetingManagePage from "../pages/MeetingManagePage";
import UserManagePage from "../pages/UserManagePage";
import OtherManagePage from "../pages/OtherManagePage";
import CreateMeeting from "../components/MeetingManage/CreateMeeting";
import MyPage from "../pages/MyPage";
import VoteEnd from "../components/VoteManage/VoteEnd";
import SessionJoinPage from "../pages/SessionJoinPage";
import Kakaocallback from "../pages/KakaoCallback";
import KakaoLoginButton from "../components/Buttons/KakaoLoginButton"; // KakaoLoginButton 컴포넌트 임포트
import UserDetailForm from "../components/UserDetailForm"; // UserDetailForm 컴포넌트 임포트

function AppRoutes() {
  return (
    <Routes>
      {/* 레이아웃 적용 X */}
      <Route path="/" element={<SocialLoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/meetingPage/:id" element={<MeetingPage />} />
      <Route path="/login/oauth2/code/kakao" element={<Kakaocallback />} />
      <Route path="/kakao-login" element={<KakaoLoginButton />} />
      {/* 메인레이아웃 - 상단 툴바 및 좌측 메뉴바 */}
      <Route element={<MainLayout />}>
        {/* 메인 페이지 */}
        <Route path="/home" element={<HomePage />} />

        {/* 유저관리 페이지 */}
        <Route path="/userManage" element={<UserManagePage />}>
          <Route index element={<Navigate to="approval" />} />
          <Route path="detail" element={<UserDetailForm />} />
          {/* <Route path="approval" element={<Approval />} />
          <Route path="manage" element={<Manage />} /> */}
          <Route path="/userManage/approval" element={<Approval />} />
          <Route path="/userManage/manage" element={<Manage />} />
        </Route>

        {/* 회의관리 페이지 */}
        <Route path="/meeting" element={<MeetingManagePage />}>
          <Route index element={<Navigate to="reservedMeeting" />} />
          <Route path="reservedMeeting" element={<ReservedMeeting />} />
          <Route path="finishedMeeting" element={<FinishedMeeting />} />
          <Route path="createMeeting" element={<CreateMeeting />} />
          <Route path="sessionJoin" element={<SessionJoinPage />} />
        </Route>

        {/* 커뮤니티 페이지 */}
        <Route path="/community" element={<CommunityPage />}>
          <Route index element={<Navigate to="notice" />} />
          <Route path="notice/*" element={<Notice />} />
          <Route path="ask" element={<Ask />} />
          <Route path=":boardType/detail/:id" element={<Detail />} />
          <Route path=":boardType/edit/:id" element={<Update />} />
          <Route path=":boardType/write" element={<Write />} />
        </Route>

        {/* 투표관리 페이지 */}
        <Route path="/vote" element={<VoteManagePage />}>
          <Route index element={<Navigate to="active" />} />
          <Route path="active" element={<ActiveVote />} />
          <Route path="finish" element={<FinishedVote />} />
          <Route path="create" element={<VoteCreatePage />} />
          <Route path="active/detail/:id" element={<VoteDetail />} />
          <Route path="finish/detail/:id" element={<VoteEnd />} />
        </Route>
        {/* 메세지 전송 */}
        <Route path="/message" element={<SendMessage />} />
        {/* 마이페이지 */}
        <Route path="/user" element={<MyPage />}></Route>
        {/* 기타 관리 */}
        <Route path="/others" element={<OtherManagePage />}></Route>
      </Route>

      {/* 기타 레이아웃, 추가시 */}
    </Routes>
  );
}

export default AppRoutes;
