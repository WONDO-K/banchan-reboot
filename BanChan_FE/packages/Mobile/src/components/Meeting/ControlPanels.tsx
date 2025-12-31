import React, { useEffect } from "react";
import { ControlPanelsProps } from "../../Types";

const ControlPanels: React.FC<ControlPanelsProps> = ({
  activeIcons,
  handleButtonClick,
}) => {
  useEffect(() => {
    
  }, [activeIcons]);

  return (
    <div className="flex justify-center items-center bg-blue-200 rounded-full py-2 px-4 mt-10 w-[320px] mx-auto">
      <div className="flex space-x-4">
        <button
          className={`flex justify-center items-center w-10 h-10 rounded-full ${
            !activeIcons.mic ? "bg-gray-700" : "bg-white"
          }`}
          onClick={() => handleButtonClick("mic")}
        >
          <span
            className={`material-symbols-outlined text-xl ${
              !activeIcons.mic ? "text-white" : "text-gray-700"
            }`}
          >
            {!activeIcons.mic ? "mic_off" : "mic"}
          </span>
        </button>

        <button
          className={`flex justify-center items-center w-10 h-10 rounded-full ${
            !activeIcons.videocam ? "bg-gray-700" : "bg-white"
          }`}
          onClick={() => handleButtonClick("videocam")}
        >
          <span
            className={`material-symbols-outlined text-xl ${
              !activeIcons.videocam ? "text-white" : "text-gray-700"
            }`}
          >
            {!activeIcons.videocam ? "videocam_off" : "videocam"}
          </span>
        </button>

        <button
          className={`flex justify-center items-center w-10 h-10 rounded-full ${
            activeIcons.chat_bubble ? "bg-gray-700" : "bg-white"
          }`}
          onClick={() => handleButtonClick("chat_bubble")}
        >
          <span
            className={`material-symbols-outlined text-xl ${
              activeIcons.chat_bubble ? "text-white" : "text-gray-700"
            }`}
          >
            chat_bubble
          </span>
        </button>

        <button
          className={`flex justify-center items-center w-10 h-10 rounded-full ${
            activeIcons.headset_mic ? "bg-gray-700" : "bg-white"
          }`}
          onClick={() => handleButtonClick("headset_mic")}
        >
          <span
            className={`material-symbols-outlined text-xl ${
              activeIcons.headset_mic ? "text-white" : "text-gray-700"
            }`}
          >
            {activeIcons.headset_mic ? "headset_off" : "headset_mic"}
          </span>
        </button>

        <button
          className="flex justify-center items-center w-10 h-10 rounded-full bg-red-500"
          onClick={() => handleButtonClick("exit_to_app")}
        >
          <span className="material-symbols-outlined text-white text-xl">
            exit_to_app
          </span>
        </button>
      </div>
    </div>
  );
};

export default ControlPanels;
