import api from "./axios";

// 배우 상세 정보
export const getActorDetails = async (actorId) => {
  try {
    const response = await api.get(`/api/actors/${actorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching actor details:", error);
    throw error;
  }
};

// 배우의 출연 영화 목록
export const getActorMovies = async (actorId) => {
  try {
    const response = await api.get(`/api/actors/${actorId}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching actor movies:", error);
    throw error;
  }
};

// 배우의 출연 TV 시리즈 목록
export const getActorTVShows = async (actorId) => {
  try {
    const response = await api.get(`/api/actors/${actorId}/tv`);
    return response.data;
  } catch (error) {
    console.error("Error fetching actor TV shows:", error);
    throw error;
  }
};
