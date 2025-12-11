import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const posterUrl = movie.posterPath 
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : '/placeholder-movie.jpg';

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const displayRating = movie.voteAverage > 0 ? movie.voteAverage.toFixed(1) : 'Unrated';
  const displayYear = movie.releaseDate ? movie.releaseDate.split('-')[0] : 'TBA';

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-poster">
        <img 
          src={posterUrl} 
          alt={movie.title} 
          onError={(e) => e.target.src = '/placeholder-movie.jpg'}
        />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="rating">⭐ {displayRating}</span>
          <span className="year">{displayYear}</span>
        </div>
        {/* The overview is hidden by CSS for a cleaner card, but is here for context */}
        <p className="movie-overview">{movie.overview || '설명이 없습니다.'}</p>
      </div>
    </div>
  );
};

export default MovieCard;