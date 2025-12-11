import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import CommentSection from '../components/review/CommentSection';
import { movieApi } from '../api/movieApi';
import { reviewApi } from '../api/reviewApi'; // Import reviewApi
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import './MovieDetailPage.css';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Get auth state

  useEffect(() => {
    const fetchMovieAndReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch movie details
        const movieData = await movieApi.getMovieById(id);
        setMovie(movieData);

        // Fetch reviews for this movie
        const reviewData = await reviewApi.getReviewsByMovieId(movieData?.tmdbId);
        setReviews(reviewData);

      } catch (error) {
        console.error('Error fetching movie details or reviews:', error);
        setError('정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieAndReviews();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="movie-detail-page">
        <Header />
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-page">
        <Header />
        <button onClick={() => navigate(-1)} className="back-button">← 뒤로 가기</button>
        <div className="error-message">{error || '영화를 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      <Header />
      <button onClick={() => navigate(-1)} className="back-button">← 뒤로 가기</button>
      
      <div className="movie-detail">
        <div className="movie-poster">
          <img 
            src={movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : '/placeholder-movie.jpg'}
            alt={movie.title} 
            onError={(e) => e.target.src = '/placeholder-movie.jpg'}
          />
        </div>
        
        <div className="movie-info">
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-meta">
            <span className="rating">⭐ {movie.voteAverage?.toFixed(1)}</span>
            <span className="year">{movie.releaseDate?.split('-')[0]}</span>
            <span className="language">{movie.originalLanguage?.toUpperCase()}</span>
          </div>
          <p className="movie-overview">{movie.overview}</p>
        </div>

        {/* New Review Section */}
        <div className="review-section">
          <div className="review-section-header">
            <h2>리뷰</h2>
            {isAuthenticated && (
              <Link
                to="/reviews/write"
                state={{ movie: { id: movie.tmdbId, title: movie.title } }}
                className="write-review-btn"
              >
                리뷰 작성
              </Link>
            )}
          </div>
          <div className="review-list">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.boardNo} className="review-item">
                  <Link to={`/reviews/${review.boardNo}`}>
                    <h3 className="review-title">{review.boardTitle}</h3>
                    <span className="review-author">{review.memberId}</span>
                  </Link>
                </div>
              ))
            ) : (
              <p>작성된 리뷰가 없습니다.</p>
            )}
          </div>
        </div>
        
        {/* Existing Comment Section - The user might want this to be for the movie, or for a review. Clarification might be needed. For now, leaving as is.*/}
        <CommentSection movieId={movie.id} />
      </div>
    </div>
  );
};

export default MovieDetailPage;