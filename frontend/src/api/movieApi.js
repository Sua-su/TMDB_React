import api from "./axios";

// 영화 목록 가져오기 API
export const getAllMovies = async () => {
  try {
    const response = await api.get("/movies");
    return response.data;
  } catch (error) {
    throw error;
  }
};
