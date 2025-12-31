import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "../Table";
import Nav from "../Nav";
import NavItem from "../NavItem";
import SmallButton from "../Buttons/SmallButton";
import { useCookies } from "react-cookie";

interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  date: string;
  address: string;
  role: string;
  username: string;
}

const approve = (handleApprove: () => void) => {
  return (
    <SmallButton
      title="승인"
      bgColor="bg-white"
      txtColor="text-customBlue"
      borderColor="border-customBlue"
      onClick={handleApprove}
    />
  );
};

const reject = (handleReject: () => void) => {
  return (
    <SmallButton
      title="거절"
      bgColor="bg-white"
      txtColor="text-customRed"
      borderColor="border-customRed"
      onClick={handleReject}
    />
  );
};

const headers = ["번호", "이름", "연락처", "이메일", "신청일", "동/호수", "승인", "거절"];

const NavElements = () => {
  return (
    <Nav>
      <NavItem to="/userManage/approval" label="신규 승인대기" />
      <NavItem to="/userManage/manage" label="입주민 관리" />
    </Nav>
  );
};

const Approval: React.FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["Token"]);
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information to check role
        const userInfoResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/myinfo`, {
          headers: {
            Authorization: `Bearer ${cookies.Token}`,
          },
        });

        const currentUser = userInfoResponse.data;
        if (currentUser.role !== "ADMIN") {
          alert("권한이 없습니다. 관리자만 접근할 수 있습니다.");
          navigate("/home");
          return;
        }

        // Fetch approval list
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/approval`, {
          headers: {
            Authorization: `Bearer ${cookies.Token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("권한이 없습니다. 관리자만 접근할 수 있습니다.");
        navigate("/home");  // 권한이 없는 경우 홈페이지로 리다이렉트
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cookies.Token, navigate]);

  const handleApprove = async (user: User) => {
    try {
      const encodedUsername = user.username;
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/approval/${encodedUsername}`;
      await axios.post(apiUrl, {}, {
        headers: {
          Authorization: `Bearer ${cookies.Token}`,
        },
      });
      setData((prevData) => prevData.filter((u) => u.id !== user.id));
      alert("사용자가 승인되었습니다.");
    } catch (error) {
      console.error("Error approving user:", error);
      alert("사용자 승인이 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleReject = async (user: User) => {
    try {
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/reject/${user.username}`;
      await axios.post(apiUrl, {}, {
        headers: {
          Authorization: `Bearer ${cookies.Token}`,
        },
      });
      setData((prevData) => prevData.filter((u) => u.id !== user.id));
      alert("사용자가 거절되었습니다.");
    } catch (error) {
      console.error("Error rejecting user:", error);
      alert("사용자 거절이 실패했습니다. 다시 시도해주세요.");
    }
  };

  const rows = data.map((user) => [
    user.id,
    user.name,
    user.phone,
    user.email,
    user.date,
    user.address,
    user.username,
    approve(() => handleApprove(user)),
    reject(() => handleReject(user)),
  ]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <NavElements />
      <div className="container mx-auto p-4 mt-3">
        <Table headers={headers} data={rows} />
      </div>
    </>
  );
};

export default Approval;
