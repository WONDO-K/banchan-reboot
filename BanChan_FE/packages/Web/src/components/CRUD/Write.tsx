import React, { useState } from "react";
import SmallButton from "../Buttons/SmallButton";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
const baseUrl = import.meta.env.VITE_API_URL;

const WriteContent = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { boardType } = useParams();
  const [cookies] = useCookies();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const CreateCommunity = async (
    Token: string,
    data: { title: string; content: string }
  ) => {
    try {
      console.log(data);
      if (boardType == "ask") {
        const response = await axios.post(
          `${baseUrl}/api/${boardType}/regist`,
          {
            ...data,
          },
          {
            headers: {
              Authorization: `Bearer ${Token}`, // Use response data here
            },
          }
        );

        return response.data; // content 배열만 반환
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (file) {
          formData.append("files", file);
          console.log("gi");
          console.log(file);
        }
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }
        const response = await axios.post(
          `${baseUrl}/api/${boardType}/regist`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${Token}`, // Use response data here
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("hi");
        console.log(response);
        return response.data; // content 배열만 반환
      }
    } catch (error) {
      console.error("생성 중 오류가 발생하였습니다", error);
    }
  };
  const SubmitHandle = () => {
    const data = {
      title: title,
      content: content,
    };

    CreateCommunity(cookies.Token, data).then(() => {
      alert("게시글 작성이 완료되었습니다.");
      window.location.href = `/community/${boardType}`;
    });
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-7xl h-[750px]">
      <div className="mt-[20px]">
        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2">
            제목
          </label>
          <input
            type="text"
            placeholder="제목을 입력해 주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-[60px] px-3 py-2 border bg-customInputStyle border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2">
            내용
          </label>
          <textarea
            placeholder="본문 내용을 입력해 주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[350px] px-3 py-2 bg-customInputStyle border border-gray-300 rounded-lg  resize-none focus:outline-none focus:ring focus:ring-blue-200"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-bold mb-2">
            파일 업로드
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
          />
          {file && (
            <p className="text-gray-500 mt-2">첨부된 파일: {file.name}</p>
          )}
        </div>
        <div className="flex  justify-end mt-[40px]">
          <SmallButton
            title="글작성"
            bgColor="bg-customFocusedTextColor"
            txtColor="text-white"
            onClick={SubmitHandle}
          />
        </div>
      </div>
    </div>
  );
};

const Write = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-customBackgroundColor p-4">
      <WriteContent />
    </div>
  );
};

export default Write;
