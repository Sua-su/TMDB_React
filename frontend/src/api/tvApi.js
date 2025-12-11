import api from "./axios";

// TV 시리즈 목록 조회
export const getTVShows = async (page = 1, sort = "popular") => {
  try {
    const response = await api.get("/tv", {
      params: { page, sort },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    throw error;
  }
};

// TV 시리즈 검색
export const searchTVShows = async (query, page = 1) => {
  try {
    const response = await api.get("/tv/search", {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching TV shows:", error);
    throw error;
  }
};

// TV 시리즈 상세 정보
export const getTVShowDetails = async (tvId) => {
  try {
    const response = await api.get(`/tv/${tvId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    throw error;
  }
};
