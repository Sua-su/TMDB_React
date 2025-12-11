import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { reviewApi } from '../api/reviewApi';
import { replyApi } from '../api/replyApi';
import Header from '../components/common/Header';
import './ReviewDetail.css';

const ReviewDetail = () => {
  const { boardNo } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [review, setReview] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviewAndReplies = useCallback(async () => {
    try {
      setLoading(true);
      const reviewData = await reviewApi.getReviewById(boardNo);
      setReview(reviewData);
      const repliesData = await replyApi.getRepliesByReviewId(boardNo);
      setReplies(repliesData);
    } catch (err) {
      setError('리뷰를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [boardNo]);

  useEffect(() => {
    fetchReviewAndReplies();
  }, [fetchReviewAndReplies]);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!newReplyContent.trim()) return;

    const replyData = {
      boardNo: review.boardNo,
      memberId: user.memberId,
      replyContent: newReplyContent,
      evaluation: 'GOOD', // Evaluation feature can be re-added if needed
    };

    try {
      await replyApi.writeReply(replyData);
      setNewReplyContent('');
      fetchReviewAndReplies(); // Re-fetch everything to show the new reply
    } catch (err) {
      console.error('Failed to submit reply:', err);
      alert('댓글 등록에 실패했습니다.');
    }
  };

  const handleDeleteReview = async () => {
    if (window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      try {
        const response = await reviewApi.deleteReview(boardNo);
        if (response.status === 'success') {
          alert('리뷰가 삭제되었습니다.');
          navigate('/reviews'); // Navigate to the review list page
        } else {
          alert('삭제에 실패했습니다.');
        }
      } catch (err) {
        console.error('Failed to delete review:', err);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };
  
  const handleEditReview = () => {
    navigate(`/reviews/edit/${boardNo}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!review) return <div className="error-message">리뷰를 찾을 수 없습니다.</div>;

  const isAuthor = isAuthenticated && user.memberId === review.memberId;

  return (
    <>
      <Header />
      <div className="review-detail-page">
        <div className="review-detail-container">
          <header className="review-header">
            <Link to={`/movie/${review.mvNo}`} className="movie-title-link">
              🎬 {review.movieTitle}
            </Link>
            <h1>{review.boardTitle}</h1>
            <div className="review-meta">
              <span>작성자: {review.memberId}</span>
              <span>작성일: {new Date(review.regDate).toLocaleDateString()}</span>
            </div>
          </header>

          <div className="review-content">{review.boardContent}</div>

          {isAuthor && (
            <div className="review-actions">
              <button className="action-btn" onClick={handleEditReview}>수정</button>
              <button className="action-btn delete-btn" onClick={handleDeleteReview}>삭제</button>
            </div>
          )}

          <section className="replies-section">
            <h2>댓글 ({replies.length})</h2>
            
            {isAuthenticated ? (
              <form className="reply-form" onSubmit={handleSubmitReply}>
                <textarea
                  placeholder="댓글을 입력하세요..."
                  value={newReplyContent}
                  onChange={(e) => setNewReplyContent(e.target.value)}
                  required
                />
                <button type="submit" className="submit-btn">등록</button>
              </form>
            ) : (
              <p>댓글을 작성하려면 로그인해주세요.</p>
            )}

            <div className="reply-list">
              {replies.map((reply) => (
                <div key={reply.replyNo} className="reply-item">
                  <div className="reply-header">
                    <span className="reply-author">{reply.memberId}</span>
                    <span className="reply-date">{new Date(reply.regDate).toLocaleDateString()}</span>
                  </div>
                  <p className="reply-content">{reply.replyContent}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ReviewDetail;