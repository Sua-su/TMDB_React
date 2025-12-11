import api from "./axios";

export const movieApi = {
  getAllMovies: async () => {
    const response = await api.get("/movies");
    return response.data;
  },

  getPopularMovies: async (page = 1) => {
    const response = await api.get(`/movies?sort=popular&page=${page}`);
    return response.data;
  },

  getTopRatedMovies: async (page = 1) => {
    const response = await api.get(`/movies?sort=top_rated&page=${page}`);
    return response.data;
  },

  getMoviesByName: async (page = 1) => {
    const response = await api.get(`/movies?sort=name&page=${page}`);
    return response.data;
  },

  searchMovies: async (query, page = 1) => {
    const response = await api.get(
      `/movies/search?query=${encodeURIComponent(query)}&page=${page}`
    );
    return response.data;
  },

  getMovieById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  // 댓글 관련 API
  getMovieComments: async (movieId) => {
    const response = await api.get(`/movies/${movieId}/comments`);
    return response.data;
  },

  createComment: async (movieId, content) => {
    const response = await api.post(`/movies/${movieId}/comments`, { content });
    return response.data;
  },

  likeComment: async (commentId) => {
    const response = await api.put(`/movies/comments/${commentId}/like`);
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/movies/comments/${commentId}`);
    return response.data;
  },

  // 사용자 댓글 목록 조회
  getUserComments: async () => {
    const response = await api.get("/movies/comments/user");
    return response.data;
  },
};
