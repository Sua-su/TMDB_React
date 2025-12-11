import api from "./axios";

// 회원가입 API
export const register = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "회원가입에 실패했습니다."
    );
  }
};

// 로그인 API
export const login = async (memberId, password) => {
  const response = await api.post('/login', { memberId, password });
  return response.data;
};

// 로그아웃 API
export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    console.error("로그아웃 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "로그아웃에 실패했습니다."
    );
  }
};

// 현재 로그인 사용자 정보 API
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/me");
    return response.data;
  } catch (error) {
    console.error(
      "사용자 정보 조회 실패:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "사용자 정보를 불러오는데 실패했습니다."
    );
  }
};

// 비밀번호 찾기 API
export const findPassword = async (name, email) => {
  try {
    const response = await api.post("/find-password", { name, email });
    return response.data;
  } catch (error) {
    console.error("비밀번호 찾기 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "비밀번호 찾기에 실패했습니다."
    );
  }
};
