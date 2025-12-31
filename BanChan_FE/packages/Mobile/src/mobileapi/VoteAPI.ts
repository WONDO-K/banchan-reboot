import { VoteGetType, VoteDetailType,VoteType,VoteResultType} from "../Types";
import axios,{AxiosResponse } from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getVote = async (Token:string,API_REST:string):Promise<VoteGetType> => {
    try {
      const response: AxiosResponse<VoteGetType> = await axios.get(`${API_URL}/${API_REST}`, {
        headers: {
          Authorization: `Bearer ${Token}`, // Use response data here
        }
      });
      return response.data; // content 배열만 반환
    } catch (error) {
      console.error("데이터를 가져오는 중 오류가 발생했습니다!", error);
      return {data : []};
    }
  };

  // 투표 상세조회
export const getVoteDetail = async (Token:string,API_REST:string) => {
    try {
      const response: AxiosResponse<VoteDetailType> = await axios.get(`${API_URL}/${API_REST}`, {
        headers: {
          Authorization: `Bearer ${Token}`, // Use response data here
        }
      });
      return response.data; // content 배열만 반환
    } catch (error) {
      console.error("데이터를 가져오는 중 오류가 발생했습니다!", error); 
    }
  };

// 투표 결과조회 
  export const getVoteResult = async (Token:string,API_REST:string) => {
    try {
      const response: AxiosResponse<VoteResultType> = await axios.get(`${API_URL}/${API_REST}`, {
        headers: {
          Authorization: `Bearer ${Token}`, // Use response data here
        }
      });
      return response.data; // content 배열만 반환
    } catch (error) {
      console.error("데이터를 가져오는 중 오류가 발생했습니다!", error); 
    }
  };
  

  // 투표 진행
export const doVote = async (Token:string,API_REST:string,data:VoteType) => {
    try {
      const response = await axios.post(`${API_URL}/${API_REST}`,data
        , {
        headers: {
          'Authorization': `Bearer ${Token}`, // Use response data here
          'Content-Type': 'application/json',
  
        }
      });
      return response.data; // content 배열만 반환
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error data:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
      } else {
        console.error('Error message:', error);
      }
    }
  };
  