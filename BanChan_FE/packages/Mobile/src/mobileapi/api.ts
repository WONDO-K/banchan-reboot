import axios from 'axios';


const API_URL = import.meta.env.VITE_M_API_URL; // 모바일 환경 변수 확인

const apiClient = axios.create({
  baseURL: API_URL, // 환경 변수를 사용하여 API URL 설정
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // 쿠키에 저장했으면 쿠키에서 가져오는 로직으로 변경 필요
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken'); // 마찬가지로 쿠키로 바꿨다면 수정 필요
      try {
        const response = await axios.post(`${API_URL}/auth/token/refresh`, { refreshToken });
        localStorage.setItem('accessToken', response.data.accessToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;