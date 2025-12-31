import React, { useState, ChangeEvent, FormEvent } from "react";

interface Message {
  id: number;
  text: string;
}

interface ChatBoxProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  onClose: () => void; // 닫기 버튼을 처리하기 위한 콜백
  className?: string; // 스타일을 받을 수 있도록 수정
}

const Chat: React.FC<ChatBoxProps> = ({
  onSendMessage,
  messages,
  onClose,
  className,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className=" bg-blue-100 rounded-[16px] p-4 shadow-lg relative h-full">
        {/* 메시지 리스트 영역 */}
        <div className="flex-1 mb-4 overflow-y-auto border border-gray-200 p-4 rounded h-[120px]">
          {messages.map((message) => (
            <div key={message.id} className="mb-2 p-2 bg-gray-100 rounded">
              <div className="font-bold">{"동대표"}</div>
              <div>{message.text}</div>
            </div>
          ))}
        </div>

        {/* 메시지 입력 영역 */}
        <form onSubmit={handleFormSubmit}>
          <div className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="메시지를 입력하세요"
              className="flex-1 bg-white rounded-[25px] px-7 py-2 shadow-inner text-gray-800 outline-none"
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-blue-500 text-white rounded-[8px] shadow-lg flex items-center justify-center w-10 h-10"
            >
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </div>
        </form>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
};

export default Chat;
