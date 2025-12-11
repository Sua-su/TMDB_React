import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { reviewApi } from '../api/reviewApi';
import Header from '../components/common/Header';
import './ReviewList.css';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewApi.getAllReviews();
        setReviews(data);
      } catch (err) {
        setError('리뷰 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <>
      <Header />
      <div className="review-list-page">
        <div className="review-list-header">
          <h1>리뷰 목록</h1>
          {isAuthenticated && (
            <Link to="/reviews/write" className="write-review-btn">
              리뷰 작성하기
            </Link>
          )}
        </div>

        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="review-list-container">
            {reviews.length === 0 ? (
              <div className="no-results">등록된 리뷰가 없습니다.</div>
            ) : (
              reviews.map((review) => (
                <Link key={review.boardNo} to={`/reviews/${review.boardNo}`} className="review-card-link">
                  <div className="review-card-header">
                    <h2 className="review-card-title">{review.boardTitle}</h2>
                    <span className="review-card-movie-title">
                      {review.movieTitle || '알 수 없는 영화'}
                    </span>
                  </div>
                  <div className="review-card-meta">
                    <span>작성자: {review.memberId}</span>
                    <span>작성일: {new Date(review.regDate).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewList;
