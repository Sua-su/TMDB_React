import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { reviewApi } from '../api/reviewApi';
import Header from '../components/common/Header';
import './ReviewWrite.css';

const ReviewWrite = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // State from navigation, expected to contain movie id and title
  const movie = location.state?.movie;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If not authenticated or no movie info is passed, redirect
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
    if (!movie) {
      alert('리뷰를 작성할 영화 정보가 없습니다. 영화 상세 페이지에서 다시 시도해주세요.');
      navigate(-1); // Go back to the previous page
    }
  }, [isAuthenticated, movie, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');

    const reviewData = {
      memberId: user.memberId,
      boardTitle: title,
      boardContent: content,
      mvNo: movie.id,
    };

    try {
      const response = await reviewApi.writeReview(reviewData);
      if (response.success) {
        // Navigate to the new review's detail page
        navigate(`/reviews/${response.data.boardNo}`);
      } else {
        setError(response.message || '리뷰 등록에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Error submitting review:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the movie detail page
  };

  if (!movie) {
    // Render nothing or a loading state while redirecting
    return null;
  }

  return (
    <>
      <Header />
      <div className="review-write-page">
        <div className="review-write-form-container">
          <h1>리뷰 작성</h1>
          
          <div className="movie-title-display">
            <p>선택된 영화: <strong>{movie.title}</strong></p>
          </div>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">제목</label>
              <input 
                id="title"
                type="text" 
                placeholder="리뷰 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">내용</label>
              <textarea 
                id="content"
                placeholder="영화에 대한 감상을 자유롭게 작성해주세요."
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
                {loading ? '등록 중...' : '등록하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReviewWrite;