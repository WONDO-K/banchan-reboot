import React, { useEffect } from "react";
import { ControlPanelsProps } from "../../Type";

const ControlPanels: React.FC<ControlPanelsProps> = ({
  // onChatToggle,
  activeIcons,
  handleButtonClick,
}) => {
  useEffect(() => {
  }, [activeIcons]);
  return (
    <div className="px-4 flex items-center mt-10">
      <div className="flex space-x-8 ml-[210px]">
        <button
          className={`bg-gray-800 text-white flex items-center px-4 py-2 rounded-full`}
          onClick={() => handleButtonClick("mail")}
        >
          <span className={`material-symbols-outlined`}>{"mail"}</span>
          <span className="ml-2">알림 보내기</span>
        </button>
        <button
          className={`bg-gray-800 text-white flex items-center px-4 py-2 rounded-full ${
            !activeIcons.mic ? "text-customRed" : "text-white"
          }`}
          onClick={() => handleButtonClick("mic")}
        >
          <span
            className={`material-symbols-outlined ${
              !activeIcons.mic ? "text-customRed" : "text-white"
            }`}
          >
            {!activeIcons.mic ? "mic_off" : "mic"}
          </span>
          <span className="ml-2">
            {!activeIcons.mic ? "마이크 켜기" : "마이크 끄기"}
          </span>
        </button>
        <button
          className={`bg-gray-800 text-white flex items-center px-4 py-2 rounded-full ${
            !activeIcons.videocam ? "text-customRed" : "text-white"
          }`}
          onClick={() => handleButtonClick("videocam")}
        >
          <span
            className={`material-symbols-outlined ${
              !activeIcons.videocam ? "text-customRed" : "text-white"
            }`}
          >
            {!activeIcons.videocam ? "videocam_off" : "videocam"}
          </span>
          <span className="ml-2">
            {!activeIcons.videocam ? "비디오 켜기" : "비디오 끄기"}
          </span>
        </button>
        <button
          className="bg-gray-800 text-white flex items-center px-4 py-2 rounded-full"
          onClick={() =>
            handleButtonClick(
              activeIcons.radio_button_checked
                ? "radio_button_unchecked"
                : "radio_button_checked"
            )
          }
        >
          <span
            className={`material-symbols-outlined ${
              activeIcons.radio_button_checked ? "text-customRed" : "text-white"
            }`}
          >
            {!activeIcons.radio_button_checked
              ? "radio_button_checked"
              : "radio_button_unchecked"}
          </span>
          <span className="ml-2">
            {!activeIcons.radio_button_checked ? "녹화 시작" : "녹화 종료"}
          </span>
        </button>

        <button
          className={`bg-gray-800 text-white flex items-center px-4 py-2 rounded-full ${
            activeIcons.headset_mic ? "text-customRed" : "text-white"
          }`}
          onClick={() => handleButtonClick("headset_mic")}
        >
          <span
            className={`material-symbols-outlined ${
              activeIcons.headset_mic ? "text-customRed" : "text-white"
            }`}
          >
            {activeIcons.headset_mic ? "headset_off" : "headset_mic"}
          </span>
          <span className="ml-2">
            {activeIcons.headset_mic ? "음소거 끄기" : "음소거 켜기"}
          </span>
        </button>
        <button
          className="bg-red-500 text-white flex items-center px-4 py-2 rounded-full"
          onClick={() => handleButtonClick("exit_to_app")}
        >
          <span className={`material-symbols-outlined`}>exit_to_app</span>
          <span className="ml-2">회의 종료하기</span>
        </button>
      </div>

      <div className="flex space-x-10 ml-[100px]">
        <span className="cursor-pointer material-symbols-outlined text-white">
          book
        </span>
        <span className="cursor-pointer material-symbols-outlined text-white">
          group
        </span>
        <span
          className={`cursor-pointer material-symbols-outlined ${
            activeIcons.chat_bubble ? "text-blue-500" : "text-white"
          }`}
          onClick={() => handleButtonClick("chat_bubble")}
        >
          chat_bubble
        </span>
        <div className="relative">
          <span className="cursor-pointer material-symbols-outlined text-yellow-500">
            notifications
          </span>
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            1
          </span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanels;
