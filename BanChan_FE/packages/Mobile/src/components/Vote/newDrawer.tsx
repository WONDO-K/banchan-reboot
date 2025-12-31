import React, { useState, useEffect } from "react";
import { newDrawerProps } from "../../Types";
import axios from "axios";
import { useCookies } from "react-cookie";
import CryptoJS from 'crypto-js';


const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_MESSAGE_API_KEY
const API_SECRET = import.meta.env.VITE_MESSAGE_API_SECRET_KEY

// ISO 8601 형식의 현재 시간 생성
const getCurrentIsoDate = (): string => {
    return new Date().toISOString();
  };
  
  // 랜덤 문자열 생성
  const generateSalt = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };
  
  // HMAC-SHA256 서명 생성
  const generateSignature = (date: string, salt: string): string => {
    const data = `${date}${salt}`;
    return CryptoJS.HmacSHA256(data, API_SECRET).toString(CryptoJS.enc.Hex);
  };
  
  interface Message {
    to: string;
    from: string;
    text: string;
    subject?: string;
    autoTypeDetect: boolean;
  }

  interface CoolSMSResponse {
    statusCode: number;
    statusMessage: string;
    // 추가적인 CoolSMS 응답 타입이 필요할 경우 여기에 정의
  }



interface Item {
  id: number;
  title: string;
  date: string;
  voteRate: number;
  voted: boolean;
  onClick: () => void;
}

// OTPModal 컴포넌트
const OTPModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpValidTimer, setOtpValidTimer] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [cookies] = useCookies()
  const Token = cookies.Token
  useEffect(() => {
    let resendInterval: NodeJS.Timeout;
    let validInterval: NodeJS.Timeout;

    if (resendTimer > 0) {
      resendInterval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (otpValidTimer > 0) {
      validInterval = setInterval(() => {
        setOtpValidTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (otpValidTimer === 0 && isOtpSent) {
      setIsOtpSent(false);
    }

    return () => {
      clearInterval(resendInterval);
      clearInterval(validInterval);
    };
  }, [resendTimer, otpValidTimer, isOtpSent]);



        



    const sendOTP = async (messages: Message[]): Promise<CoolSMSResponse> => {
      const date = getCurrentIsoDate();
      const salt = generateSalt();
      const signature = generateSignature(date, salt);
    
      const authorizationHeader = `HMAC-SHA256 apiKey=${API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;
    
      try {
        const response = await axios.post('https://api.coolsms.co.kr/messages/v4/send-many/detail', {
          messages
        }, {
          headers: {
            'Authorization': authorizationHeader
          }
        });
        return response.data;
      } catch (error) {
        console.error('Failed to send SMS:', error);
        throw error;
      }
    };

  const handleSendOTP = async () => {
    try {
      const user = await axios.get(`${API_URL}/api/user/myinfo`,{
        headers : {
          Authorization: `Bearer ${Token}`
        }
      });
      if (user.data.phone.replace(/-/gi, "") != phoneNumber ) {
        alert('내 정보에 등록된 번호와 다릅니다.')
      }
      else{
        
        const response = await axios.post(`${API_URL}/api/auth/otp/generate`, {
          phoneNumber: phoneNumber
        },{
          headers : {
            Authorization: `Bearer ${Token}`
          }
        });
        
        if (response.data.success) {
          const messages = [
            {
              // 이후 밑에 주석 변경 필요
              to: phoneNumber,
              // to:'01020983066',
              from: "01020983066",
              subject: '반찬 투표 OTP 인증 메세지 입니다.',
              text: `
반찬 앱 투표 OTP 인증입니다 유효시간은 2분입니다.
인증번호 : ${response.data.otp}
              `,
              autoTypeDetect: true, // 자동 타입 감지 활성화
            },
          ];
          sendOTP(messages)
          setIsOtpSent(true);
          setResendTimer(5); // 5초 재전송 대기 시간
          setOtpValidTimer(120); // 120초 OTP 유효 시간
          // 성공 메시지 표시
        } else {
          // 실패 시 에러 메시지 표시
          console.error("OTP 생성 실패");
        }
      }
    } catch (error) {
      console.error("OTP 요청 중 오류 발생:", error);
      // 사용자에게 오류 메시지 표시
    }
  };

  const handleVerifyOTP = async () => {

    try {
      const response = await axios.post(`${API_URL}/api/auth/otp/validate`, {
        phoneNumber: phoneNumber,
        otp : otpCode
      },{
        headers : {
          Authorization: `Bearer ${Token}`
        }
      });

      if (response.data.success) {
        alert('OTP 인증에 성공하였습니다.')
        onSuccess();
      } else {
        // 실패 시 에러 메시지 표시
        alert('OTP 인증에 실패하였습니다.')
        console.error("OTP 인증 실패");
      }
    } catch (error) {
      console.error("OTP 인증 중 오류 발생:", error);
    }
  };

  const handleClose = () => {
    // 모달 닫기 시 상태 초기화
    setPhoneNumber("");
    setOtpCode("");
    setResendTimer(0);
    setOtpValidTimer(0);
    setIsOtpSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">OTP 인증</h2>
        <input
          type="tel"
          placeholder="전화번호 입력( - 제외하고 입력)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleSendOTP}
          disabled={resendTimer > 0}
          className="w-full p-2 mb-4 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {resendTimer > 0 ? `재전송 대기 (${resendTimer}s)` : "인증번호 받기"}
        </button>
        {isOtpSent && (
          <>
            <input
              type="text"
              placeholder="인증번호 입력"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full p-2 mb-4 bg-green-500 text-white rounded"
            >
              인증 확인
            </button>
            <p className="text-center text-sm text-gray-600 mb-4">
              OTP 유효 시간: {otpValidTimer}초
            </p>
          </>
        )}
        <button
          onClick={handleClose}
          className="w-full p-2 bg-gray-300 text-black rounded"
        >
          닫기
        </button>
      </div>
    </div>
  );
};
// NewDrawer 컴포넌트
const NewDrawer: React.FC<newDrawerProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  console.log(items)
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: Item) => {
    if (title === "진행중인 투표" && !item.voted) {
      setSelectedItem(item);
      setIsModalOpen(true);
    } else {
      item.onClick();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAuthSuccess = () => {
    if (selectedItem) {
      selectedItem.onClick();
    }
    setIsModalOpen(false);
  };

  return (
    <div className="px-4 py-2">
      <h3
        className="mt-4 text-xl font-bold flex items-center justify-between cursor-pointer"
        onClick={toggleDrawer}
      >
        {title}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`w-6 h-6 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </h3>
      <hr className="my-2 border-black" />
      <div
        className={`overflow-y-auto transition-all duration-500 ${
          isOpen ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        {items.map((item, index) => (
          <div
            className="py-4 border border-black rounded-2xl mt-4"
            key={index}
          >
            <div className="p-3">
              <h4 className="text-lg font-bold">{item.title}</h4>
              <p className="text-gray-600">{item.date}</p>
              <div className="mt-4 flex items-center space-x-2">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`py-2 px-4 font-semibold rounded-full ${
                    title === "진행중인 투표" && item.voted
                      ? "bg-gray-400 text-white cursor-default"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  disabled={title === "진행중인 투표" && item.voted}
                >
                  {title === "진행중인 투표"
                    ? item.voted
                      ? '투표 완료'
                      : '투표하기'
                    : '결과보기'}
                </button>
                <button className="py-2 px-4 bg-gray-200 text-blue-500 font-semibold rounded-full">
                  투표율 : {item.voteRate} %
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <OTPModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default NewDrawer;