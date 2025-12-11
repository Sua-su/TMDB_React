import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ReviewList from "../review/ReviewList";
import ReviewForm from "../review/ReviewForm";
import "./MovieDetailPage.css";

function MovieDetailPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [recommendBoard, setRecommendBoard] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadMovieDetails();
    loadReviews();
    loadRecommendBoard();
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      const apiKey = "c12ed457b94399d3c810d10b94e4e4c5";
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=ko-KR`
      );
      setMovie(response.data);
    } catch (error) {
      console.error("Error loading movie:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/movie/${movieId}`, {
        withCredentials: true,
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const loadRecommendBoard = async () => {
    try {
      const response = await axios.get("/api/boards", {
        withCredentials: true,
      });
      const board = response.data.find((b) => b.name === "추천영화");
      setRecommendBoard(board);
    } catch (error) {
      console.error("Error loading board:", error);
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    loadReviews();
  };

  const handleRecommend = () => {
    if (!user) {
      alert("로그인이 필요합니다");
      navigate("/login");
      return;
    }
    if (recommendBoard) {
      navigate(`/boards/${recommendBoard.id}`, {
        state: {
          selectedMovie: {
            id: movieId,
            title: movie.title,
            posterPath: movie.poster_path,
          },
        },
      });
    }
  };

  if (loading) {
    return <div className="text-center p-5">로딩 중...</div>;
  }

  if (!movie) {
    return <div className="text-center p-5">영화를 찾을 수 없습니다</div>;
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div className="movie-detail-container">
      <div className="movie-header">
        <div className="row">
          <div className="col-md-4">
            <img src={posterUrl} alt={movie.title} className="movie-poster" />
          </div>
          <div className="col-md-8">
            <h1>{movie.title}</h1>
            <p className="movie-tagline">{movie.tagline}</p>
            <div className="movie-info">
              <span className="badge bg-primary me-2">
                평점: {movie.vote_average?.toFixed(1)}/10
              </span>
              <span className="badge bg-secondary me-2">
                {movie.release_date}
              </span>
              <span className="badge bg-info">{movie.runtime}분</span>
            </div>
            <div className="movie-genres mt-3">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="badge bg-dark me-2">
                  {genre.name}
                </span>
              ))}
            </div>
            <h4 className="mt-4">줄거리</h4>
            <p className="movie-overview">
              {movie.overview || "줄거리 정보가 없습니다"}
            </p>
            <div className="mt-4">
              <button
                className="btn btn-success"
                onClick={handleRecommend}
              >
                <i className="bi bi-hand-thumbs-up me-2"></i>
                이 영화 추천하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-section mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>리뷰 ({reviews.length})</h3>
          {user && !showReviewForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowReviewForm(true)}
            >
              리뷰 작성
            </button>
          )}
          {!user && (
            <p className="text-muted">리뷰를 작성하려면 로그인하세요</p>
          )}
        </div>

        {showReviewForm && (
          <ReviewForm
            movieId={movieId}
            movieTitle={movie.title}
            moviePosterPath={movie.poster_path}
            onSubmit={handleReviewSubmitted}
            onCancel={() => setShowReviewForm(false)}
          />
        )}

        <ReviewList reviews={reviews} onReviewUpdate={loadReviews} />
      </div>
    </div>
  );
}

export default MovieDetailPage;
