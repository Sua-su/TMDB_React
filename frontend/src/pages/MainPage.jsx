import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import MovieCard from '../components/movie/MovieCard';
import { movieApi } from '../api/movieApi';
import './MainPage.css';

const MainPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, [sortBy, searchQuery]);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (searchQuery) {
        data = await movieApi.searchMovies(searchQuery, 1);
      } else if (sortBy === 'popular') {
        data = await movieApi.getPopularMovies(1);
      } else if (sortBy === 'top_rated') {
        data = await movieApi.getTopRatedMovies(1);
      } else if (sortBy === 'name') {
        data = await movieApi.getMoviesByName(1);
      } else {
        return;
      }
      
      setMovies(data?.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('영화 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-page">
      <Header />
      <div className="main-content">
        <div className="filter-section">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="popular">인기순</option>
            <option value="top_rated">평점순</option>
            <option value="name">이름순</option>
          </select>
          <SearchBar onSearch={setSearchQuery} />
        </div>
        
        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="movie-grid">
            {movies.length > 0 ? (
              movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            ) : (
              <div className="no-results">검색 결과가 없습니다.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
