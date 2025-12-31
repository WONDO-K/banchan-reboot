import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDetailForm: React.FC = () => {
  const [dong, setDong] = useState("");
  const [ho, setHo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // 카카오 로그인 후 저장된 userId를 가져옴
    if (!token || !userId) {
      console.error("토큰이나 사용자 ID가 없습니다.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/detail/${userId}`,
        {
          dong,
          ho,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/home"); // 홈 페이지로 이동
    } catch (error) {
      console.error("사용자 정보 업데이트 실패", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-lg font-semibold mb-4">추가 정보 입력</h2>
        <div className="mb-4">
          <label htmlFor="dong" className="block text-gray-700">
            동
          </label>
          <input
            type="text"
            id="dong"
            value={dong}
            onChange={(e) => setDong(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ho" className="block text-gray-700">
            호
          </label>
          <input
            type="text"
            id="ho"
            value={ho}
            onChange={(e) => setHo(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          저장
        </button>
      </form>
    </div>
  );
};

export default UserDetailForm;
