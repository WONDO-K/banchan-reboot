import axios from "axios";
import { CommunityParamsType } from "../Types";
const API_URL = import.meta.env.VITE_API_URL;

// 커뮤니티 get 요청 전반
export const getCommunityList = async (Token:string,API_REST:string,params:CommunityParamsType) => {
    try {
      const response = await axios.get(`${API_URL}/${API_REST}`, {
        headers: {
          Authorization: `Bearer ${Token}`, // Use response data here
        },
        params
      });
      return response.data; // content 배열만 반환
    } catch (error) {
      console.error("데이터를 가져오는 중 오류가 발생했습니다!", error);
      return {content:[]};
    }
  };

export const getCommunityDetails = async (Token: string,API_REST: string) => {
  try {
    const response = await axios.get(`${API_URL}/${API_REST}`,
      {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      return response.data;
  } catch (error) {
    console.error("데이터를 가져오는 중 오류가 발생했습니다!", error);
    return {content:[]};
  }
}

