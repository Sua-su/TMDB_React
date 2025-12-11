import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { reviewApi } from '../api/reviewApi';
import Header from '../components/common/Header';
import './ReviewEdit.css'; // Using the new CSS file

const ReviewEdit = () => {
  const { boardNo } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [review, setReview] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReview = useCallback(async () => {
    try {
      const data = await reviewApi.getReviewById(boardNo);
      // Authorization check
      if (!isAuthenticated || user.memberId !== data.memberId) {
        alert('수정 권한이 없습니다.');
        navigate(-1);
        return;
      }
      setReview(data);
      setTitle(data.boardTitle);
      setContent(data.boardContent);
    } catch (err) {
      setError('리뷰 정보를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [boardNo, user, isAuthenticated, navigate]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }
    setLoading(true);

    const updatedReviewData = {
      boardNo: review.boardNo,
      boardTitle: title,
      boardContent: content,
    };

    try {
      const response = await reviewApi.updateReview(updatedReviewData);
      if (response.success) {
        navigate(`/reviews/${boardNo}`); // Go back to the detail page
      } else {
        setError(response.message || '리뷰 수정에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Error updating review:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <Header />
      <div className="review-write-page">
        <div className="review-write-form-container">
          <h1>리뷰 수정</h1>
          
          <div className="movie-title-display">
            <p>선택된 영화: <strong>{review?.movieTitle || '...'}</strong></p>
          </div>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="title">제목</label>
              <input 
                id="title"
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">내용</label>
              <textarea 
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="button-group">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                취소
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? '수정 중...' : '수정 완료'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReviewEdit;