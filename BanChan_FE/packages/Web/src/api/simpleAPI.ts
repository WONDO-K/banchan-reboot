import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const simpleGet = async (Token:string,API_REST:string) => {
    try {
      const response = await axios.get(`${API_URL}/${API_REST}`, {
        headers: {
          Authorization: `Bearer ${Token}`, // Use response data here
        }
      });
      return response.data; // content 배열만 반환
    } catch (error) {
      console.error("데이터를 가져오는 중 오류가 발생했습니다!", error);
    }
};

export const simpleDelete = async (Token:string,API_REST:string) => {
    try {
      const response = await axios.delete(`${API_URL}/${API_REST}`, {
        headers: {
          Authorization: `Bearer ${Token}`, // Use response data here
        }
      });
      return response.data; // content 배열만 반환
    } catch (error) {
      console.error(error);
    }
};

