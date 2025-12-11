import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./ReviewForm.css";

function ReviewForm({
  movieId,
  movieTitle,
  moviePosterPath,
  review,
  onSubmit,
  onCancel,
}) {
  const [content, setContent] = useState(review?.content || "");
  const [rating, setRating] = useState(review?.rating || 5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("로그인이 필요합니다");
      return;
    }

    if (content.length < 10) {
      setError("리뷰는 최소 10자 이상 작성해주세요");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const reviewData = {
        movieId: parseInt(movieId),
        movieTitle,
        moviePosterPath,
        content,
        rating,
      };

      console.log("Submitting review:", reviewData);

      let response;
      if (review) {
        // Update existing review
        response = await axios.put(`/api/reviews/${review.id}`, reviewData, {
          withCredentials: true,
        });
      } else {
        // Create new review
        response = await axios.post("/api/reviews", reviewData, {
          withCredentials: true,
        });
      }

      console.log("Review saved successfully:", response.data);
      alert(review ? "리뷰가 수정되었습니다" : "리뷰가 작성되었습니다");
      onSubmit();
    } catch (err) {
      console.error("Error saving review:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "리뷰 저장에 실패했습니다";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h4>{review ? "리뷰 수정" : "리뷰 작성"}</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">평점</label>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                className={`rating-btn ${rating >= num ? "selected" : ""}`}
                onClick={() => setRating(num)}
              >
                {num}
              </button>
            ))}
          </div>
          <small className="text-muted">선택한 평점: {rating}/10</small>
        </div>
        <div className="mb-3">
          <label className="form-label">리뷰 내용</label>
          <textarea
            className="form-control"
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="영화에 대한 생각을 자유롭게 작성해주세요 (최소 10자)"
            required
            minLength="10"
            maxLength="2000"
          />
          <small className="text-muted">{content.length}/2000</small>
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "저장 중..." : review ? "수정" : "작성"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
