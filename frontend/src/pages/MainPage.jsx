import React, { useEffect, useState } from 'react';
import { getAllMovies } from '../api/movieApi';
import MovieCard from '../components/MovieCard';
import './MainPage.css';

const MainPage = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError('');
      try {
        const movieData = await getAllMovies();
        setMovies(movieData);
      } catch (err) {
        setError('영화 목록을 불러오는데 실패했습니다.');
        console.error('영화 목록 에러:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="main-page">
      <header className="main-header">
        <h1>TMDB-clone</h1>
      </header>
      {isLoading ? (
        <div className="loading-message">
          <span className="spinner"></span>
          영화를 불러오는 중...
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="movie-list">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainPage;
