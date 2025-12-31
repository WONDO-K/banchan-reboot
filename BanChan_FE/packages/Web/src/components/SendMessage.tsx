import React, { useState } from "react";

import { MultiSelectDropdownProps } from "../Type";
import { useNavigate } from "react-router-dom";
import { sendSMS } from "../api/SenaMassageAPI";

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  fieldName,
  selectedOptions,
  setSelectedOptions,
}) => {
  const handleOptionChange = (option: string) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter((item) => item !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  return (
    <label className="relative z-50">
      <input type="checkbox" className="hidden peer" />
      <div className="cursor-pointer  text-base m-2 text-customTextColor after:content-['▼'] after:text-xs after:ml-1 after:inline-flex after:items-center peer-checked:after:-rotate-180 after:transition-transform">
        동호수
      </div>
      <div className="absolute bg-white border transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto max-h-60 overflow-y-auto overflow-x-auto z-50">
        <ul className="grid grid-cols-3 gap-2 p-2">
          {options.map((option) => (
            <li key={option}>
              <label className="flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100 [&:has(input:checked)]:bg-blue-200">
                <input
                  type="checkbox"
                  name={fieldName}
                  value={option}
                  className="cursor-pointer"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                />
                <span className="ml-1">{option}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </label>
  );
};

const SendMessage: React.FC = () => {
  const navigate = useNavigate();
  // 제목 내용 초기설정

  const Contents = () => {
    const [contents, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const options = ["101동", "102동", "103동", "104동", "105동", "106동"];

    const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    };
    const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      navigate(-1);
      e.preventDefault();
      const phone = ["010-2098-3066"];
      phone.map((number) => {
        const after = number.replace(/-/gi, "");
        const messages = [
          {
            to: after,
            from: "01020983066",
            subject: ``,
            text: contents,
            autoTypeDetect: true, // 자동 타입 감지 활성화
          },
        ];
        sendSMS(messages);
      });
    };
    return (
      // 백엔드로 POST 요청 보내는 로직 필요
      //투표 생성 버튼 누를 시 투표 생성 구현 필요
      <form onSubmit={handleSubmit}>
        {/* 제목 */}
        <div>
          <h2 className="text-base m-2 text-customTextColor">제목</h2>
          <input
            name="title"
            type="text"
            className="w-full h-14 bg-customBackgroundColor text-base px-4 rounded-lg shadow-md border-solid border-2 outline-none transition-transform transform"
            placeholder="제목을 입력해 주세요"
            autoComplete="off"
            value={title}
            onChange={handleTitle}
            required
          />
        </div>
        {/* 내용 */}
        <div>
          <h2 className="text-base m-2 text-customTextColor">내용</h2>
          <textarea
            name="contents"
            placeholder="제목을 입력해 주세요"
            autoComplete="off"
            value={contents}
            onChange={handleContent}
            className="w-full h-[350px]  bg-customBackgroundColor resize-none text-base px-4 py-2 rounded-lg shadow-md border-solid border-2 outline-none transition-transform transform"
            required
          />
        </div>
        {/* 투표버튼 및 투표 기간 */}
        <div className="flex pt-2">
          {/* 예약 발송 시각 설정 부분 */}
          <div>
            <span className="text-sm mx-4">메일 발송 시각 :</span>
            <input
              name="Sendtime"
              className="w-52 h-10 p-2 rounded-full border-2 text-sm transition-transform transform"
              type="datetime-local"
              required
            ></input>
          </div>
        </div>

        {/* 동호수 선택 input */}
        <MultiSelectDropdown
          options={options}
          fieldName={"baby"}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
        <div>
          <input
            name="unit"
            type="text"
            className="w-full h-14 text-base bg-customBackgroundColor p-3 rounded-lg shadow-md border-solid border-2 outline-none transition-transform transform"
            placeholder="선택된 동호수가 없습니다."
            value={selectedOptions.join(", ")}
            readOnly
          />
        </div>

        {/* 메세지 전송 버튼 */}
        <div className="pt-2 flex justify-end">
          <button
            name="submitVote"
            type="submit"
            className="w-32 h-10 bg-customBlue text-white rounded-lg transition-transform transform hover:bg-customBlue hover:scale-105"
            id="submit"
          >
            전송하기
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div className="flex justify-start p-5">
        <h3 className="text-3xl	font-semibold"> 알람 보내기</h3>
      </div>

      <div className="min-w-full min-h-[700px] p-6 bg-white border rounded-[20px] overflow-hidden">
        <Contents />
      </div>
    </div>
  );
};

export default SendMessage;
