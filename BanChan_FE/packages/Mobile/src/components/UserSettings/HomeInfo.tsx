import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { useCookies } from "react-cookie";

const HomeInfo: React.FC = () => {
  const [apartmentCode, setApartmentCode] = useState("");
  const [buildingNo, setBuildingNo] = useState("");
  const [unitNo, setUnitNo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies] = useCookies(["Token"]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); // 로딩 시작

    const requestBody = {
      aptCode: apartmentCode,
      buildingNo,
      unitNo,
    };

    // 쿠키에서 accessToken 가져오기
    const accessToken = cookies.Token;

    try {
      const response = await axios.post("/api/user/setmyapt", requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // accessToken을 Authorization 헤더에 포함
        },
        withCredentials: true, // 쿠키 인증이 필요하면 사용
      });

      if (response.status === 200) {
        alert("아파트 정보가 성공적으로 저장되었습니다.");
        navigate("/m/home"); // 알림 후 홈 페이지로 이동
      } else {
        alert("아파트 정보 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("아파트 정보 저장 오류:", error);
      alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div className="min-h-screen">
      <Header>세대 정보 기입</Header>
      <div
        className="w-full max-w-md p-8 bg-white shadow-md rounded-md h-screen"
        style={{ height: "750px" }}
      >
        <form className="mt-[20px]" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="apartmentCode"
              className="block text-sm font-medium text-gray-600"
            >
              아파트 코드
            </label>
            <input
              id="apartmentCode"
              name="apartmentCode"
              type="text"
              required
              placeholder="아파트 코드를 입력하세요"
              value={apartmentCode}
              onChange={(e) => setApartmentCode(e.target.value)}
              className="block w-full px-4 text-[14px] py-4 mt-2 mb-10 border rounded-xl shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="dongho"
              className="block text-sm font-medium text-gray-600"
            >
              동/호수
            </label>
            <div className="flex">
              <input
                id="buildingNo"
                name="buildingNo"
                type="number"
                required
                placeholder="동"
                value={buildingNo}
                onChange={(e) => setBuildingNo(e.target.value)}
                className="block w-[140px] px-4 text-[14px] py-4 mt-2 mr-4 mb-10 border rounded-xl shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300 focus:outline-none"
              />
              <input
                id="unitNo"
                name="unitNo"
                type="number"
                required
                placeholder="호수"
                value={unitNo}
                onChange={(e) => setUnitNo(e.target.value)}
                className="block w-[140px] px-4 text-[14px] py-4 mt-2 mb-10 border rounded-xl shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className={`fixed bottom-0 left-0 right-0 w-full py-4 font-semibold text-white bg-blue-500 rounded-t-xl hover:bg-blue-600 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomeInfo;
