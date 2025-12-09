import api from "./axios";

// 회원가입 API
export const register = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 로그인 API
export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 로그아웃 API
export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 현재 로그인 사용자 정보 API
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 비밀번호 찾기 API
export const findPassword = async (name, email) => {
  try {
    const response = await api.post("/find-password", { name, email });
    return response.data;
  } catch (error) {
    throw error;
  }
};
