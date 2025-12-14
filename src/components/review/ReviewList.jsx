import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ReviewForm from "./ReviewForm";
import CommentList from "./CommentList";
import axios from "axios";
import "./ReviewList.css";

function ReviewList({ reviews, onReviewUpdate }) {
  const { user } = useContext(AuthContext);
  const [editingReview, setEditingReview] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState(new Set());

  const handleDelete = async (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/reviews/${reviewId}`, {
        withCredentials: true,
      });
      onReviewUpdate();
    } catch (error) {
      alert("삭제에 실패했습니다");
    }
  };

  const toggleExpanded = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center text-muted">아직 작성된 리뷰가 없습니다</div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          {editingReview?.id === review.id ? (
            <ReviewForm
              movieId={review.movieId}
              movieTitle={review.movieTitle}
              moviePosterPath={review.moviePosterPath}
              review={review}
              onSubmit={() => {
                setEditingReview(null);
                onReviewUpdate();
              }}
              onCancel={() => setEditingReview(null)}
            />
          ) : (
            <>
              <div className="review-header">
                <div>
                  <strong>{review.user?.username || "익명"}</strong>
                  <span className="badge bg-warning text-dark ms-2">
                    ⭐ {review.rating}/10
                  </span>
                </div>
                <small className="text-muted">
                  {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                </small>
              </div>
              <div className="review-content">{review.content}</div>
              <div className="review-actions">
                {user && user.username === review.user?.username && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => setEditingReview(review)}
                    >
                      수정
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => handleDelete(review.id)}
                    >
                      삭제
                    </button>
                  </>
                )}
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => toggleExpanded(review.id)}
                >
                  {expandedReviews.has(review.id) ? "댓글 숨기기" : "댓글 보기"}
                </button>
              </div>
              {expandedReviews.has(review.id) && (
                <CommentList reviewId={review.id} />
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
