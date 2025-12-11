import api from "./axios";

export const reviewApi = {
  // Get all reviews for a specific movie
  getReviewsByMovieId: async (movieId) => {
    const response = await api.get(`/review/movie/${movieId}`);
    return response.data;
  },

  // Get all reviews
  getAllReviews: async () => {
    const response = await api.get("/review/list");
    return response.data;
  },

  // Get a single review by its ID
  getReviewById: async (boardNo) => {
    const response = await api.get(`/review/detail/${boardNo}`);
    return response.data;
  },

  // Write a new review
  writeReview: async (reviewData) => {
    const response = await api.post("/review/write", reviewData);
    return response.data;
  },

  // Delete a review by its ID
  deleteReview: async (boardNo) => {
    const response = await api.delete(`/review/${boardNo}`);
    return response.data;
  },

  // Update a review
  updateReview: async (reviewData) => {
    const response = await api.put("/review/edit", reviewData);
    return response.data;
  },
};
