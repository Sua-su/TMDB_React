import axios from "axios";

// Spring Boot 서버의 기본 URL
const API_BASE_URL = "http://localhost:8080/api";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 세션 쿠키를 포함하기 위해 필요
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30초 타임아웃
});

// 요청 인터셉터 (토큰 추가 등)
api.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 모든 요청 헤더에 Authorization 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 서버가 응답을 반환한 경우
      console.error("서버 에러:", error.response.data);
      // 401 Unauthorized 에러 처리 (토큰 만료 등)
      if (error.response.status === 401) {
        // 예: localStorage에서 토큰 제거 및 로그인 페이지로 리디렉션
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // window.location.href = '/login'; // 실제 앱에서는 적절한 리디렉션 로직 필요
      }
    } else if (error.request) {
      // 요청이 전송되었지만 응답이 없는 경우
      console.error("서버 응답 없음:", error.request);
    } else {
      // 요청 설정 중 에러가 발생한 경우
      console.error("요청 에러:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
