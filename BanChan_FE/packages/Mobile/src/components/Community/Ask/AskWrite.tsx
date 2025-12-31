import React, { useState } from "react";
import Header from "../../Header";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const AskWrite: React.FC = () => {
  // useState를 사용하여 제목, 내용, 파일의 상태를 관리합니다.
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [cookies] = useCookies();
  const navigate = useNavigate()
  // 제목 변경 핸들러
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 내용 변경 핸들러
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }



    try {
      await axios.post(`${API_URL}/api/ask/regist`, {
        title,content
      }, {
        headers: {
          Authorization: `Bearer ${cookies.Token}`,
        },
      });

      alert("파일이 성공적으로 전송되었습니다.");
      navigate(-1)
    } catch (error) {
      console.error("파일 전송 에러:", error);
      alert("파일 전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen">
      <Header>건의함</Header>
      <div className="max-w-md mx-2 p-6 bg-white border rounded-lg my-2 mt-4">
        <div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg font-semibold mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-lg font-semibold mb-2">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              className="w-full px-3 py-2 border rounded-lg h-[270px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="내용을 입력하세요"
            />
          </div>

        </div>

        <div className="border-b-2 border-black mb-4"></div>

        <div className="text-right">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            onClick={handleSubmit}
          >
            작성완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskWrite;
