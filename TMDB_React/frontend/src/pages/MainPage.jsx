import React, { useEffect, useState } from 'react';
import { getAllMovies } from '../api/movieApi';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';
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
  
      <div style={{
        backgroundColor: '#53ef12', 
        padding: '30px',
        margin: '20px',
        borderRadius: '15px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 0 15px rgba(83, 239, 18, 0.4)'
      }}>
        <Link to="/review" style={{ textDecoration: 'none', color: '#2A2A2A' }}>
          <h2 style={{ margin: 0, fontWeight: '800', fontSize: '1.5rem' }}>
            🎬 MOVIE REVIEW BOARD
          </h2>
          <p style={{ margin: '10px 0 0 0', fontWeight: 'bold' }}>
            다른 사람들의 솔직한 리뷰를 확인해보세요! &rarr;
          </p>
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
