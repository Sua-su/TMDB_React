import api from "./axios";

export const replyApi = {
  // Get all replies for a specific review
  getRepliesByReviewId: async (reviewId) => {
    const response = await api.get(`/reply/list/${reviewId}`);
    return response.data;
  },

  // Write a new reply
  writeReply: async (replyData) => {
    const response = await api.post("/reply/write", replyData);
    return response.data;
  },
};
