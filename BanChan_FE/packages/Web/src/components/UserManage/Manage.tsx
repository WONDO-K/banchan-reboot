import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "../Table";
import Nav from "../Nav";
import NavItem from "../NavItem";
import SmallButton from "../Buttons/SmallButton";
import axios from "axios";
import { useCookies } from "react-cookie";

const ModifyButton = ({ handleModify }: { handleModify: () => void }) => {
  return (
    <SmallButton
      title="수정"
      bgColor="bg-white"
      txtColor=""
      borderColor="border-customGreen"
      onClick={handleModify}
    />
  );
};

const SaveButton = ({ handleSave }: { handleSave: () => void }) => {
  return (
    <SmallButton
      title="저장"
      bgColor="bg-white"
      txtColor=""
      borderColor="border-customBlue"
      onClick={handleSave}
    />
  );
};

const DeleteButton = ({ handleDelete }: { handleDelete: () => void }) => {
  return (
    <SmallButton
      title="삭제"
      bgColor="bg-white"
      txtColor="text-customRed"
      borderColor="border-customRed"
      onClick={handleDelete}
    />
  );
};

interface User {
  id: number;
  username: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  address: string;
  approved: boolean;
}

const NavElements = () => {
  return (
    <Nav>
      <NavItem to="/userManage/approval" label="신규 승인대기" />
      <NavItem to="/userManage/manage" label="입주민 관리" />
    </Nav>
  );
};

const Manage: React.FC = () => {
  const [cookies] = useCookies(["Token"]);
  const navigate = useNavigate();
  const location = useLocation();
  const newUser: User | undefined = location.state?.user;

  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  const fetchUserDetails = useCallback(
    async (user: User) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/detail/${encodeURIComponent(user.username)}`, 
          {
            headers: {
              Authorization: `Bearer ${cookies.Token}`,
            },
          }
        );
        return { ...user, ...response.data };
      } catch (error) {
        console.error("Error fetching user details:", error);
        return user; 
      }
    },
    [cookies.Token]
  );

  const fetchData = useCallback(async () => {
    try {
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

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/list`,
        {
          headers: {
            Authorization: `Bearer ${cookies.Token}`,
          },
        }
      );
      const usersWithDetails = await Promise.all(
        response.data.map((user: User) => fetchUserDetails(user))
      );
      setUsers(usersWithDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("권한이 없습니다. 관리자만 접근할 수 있습니다.");
      navigate("/home");  
    }
  }, [cookies.Token, fetchUserDetails, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (newUser) {
      setUsers((prevUsers) => [...prevUsers, newUser]);
    }
  }, [newUser]);

  const startEditing = (user: User) => {
    setEditingId(user.id);
    setEditedUser({ ...user });
  };

  const saveChanges = async () => {
    if (editedUser) {
      try {
        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/modify/${editedUser.username}`; 
        await axios.put(apiUrl, editedUser, {
          headers: {
            Authorization: `Bearer ${cookies.Token}`,
          },
        });
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editedUser.id ? editedUser : user
          )
        );
        setEditingId(null);
        setEditedUser(null);
      } catch (error) {
        console.error("Error saving changes:", error);
      }
    }
  };

  const handleDelete = async (user: User) => {
    try {
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/revoke/${encodeURIComponent(user.username)}`; 
      await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${cookies.Token}`,
        },
      });
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== user.id)
      );
      alert("사용자가 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("사용자 삭제가 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedUser) {
      setEditedUser({ ...editedUser, [name]: value });
    }
  };

  const headers = ["번호", "이름", "연락처", "이메일", "신청일", "동/호수", "수정", "삭제"];

  const rows = users
    .filter((user) => user.approved)
    .map((user) =>
      editingId === user.id ? (
        [
          user.id,
          <input
            type="text"
            name="name"
            value={editedUser?.name}
            onChange={handleChange}
          />,
          <input
            type="text"
            name="phone"
            value={editedUser?.phone}
            onChange={handleChange}
          />,
          <input
            type="text"
            name="email"
            value={editedUser?.email}
            onChange={handleChange}
          />,
          <input
            type="text"
            name="date"
            value={editedUser?.date}
            onChange={handleChange}
          />,
          <input
            type="text"
            name="address"
            value={editedUser?.address}
            onChange={handleChange}
          />,
          <SaveButton handleSave={saveChanges} />,
          <DeleteButton handleDelete={() => handleDelete(user)} />,
        ]
      ) : (
        [
          user.id,
          user.name,
          user.phone,
          user.email,
          user.date,
          user.address,
          <ModifyButton handleModify={() => startEditing(user)} />,
          <DeleteButton handleDelete={() => handleDelete(user)} />,
        ]
      )
    );

  return (
    <>
      <NavElements />
      <div className="container mx-auto p-4 mt-3">
        <Table headers={headers} data={rows} />
      </div>
    </>
  );
};

export default Manage;
