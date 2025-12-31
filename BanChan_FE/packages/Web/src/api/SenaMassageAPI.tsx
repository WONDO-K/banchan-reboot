import axios from 'axios';
import CryptoJS from 'crypto-js';


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
  
  
  export const sendSMS = async (messages: Message[]): Promise<CoolSMSResponse> => {
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