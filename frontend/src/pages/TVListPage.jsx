import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTVShows } from '../api/tvApi';
import Header from '../components/common/Header';
import './TVListPage.css';

function TVListPage() {
  const [tvShows, setTvShows] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTVShows = async () => {
      setLoading(true);
      try {
        const data = await getTVShows(page, sortBy);
        setTvShows(data.results || []);
      } catch (error) {
        console.error('Error loading TV shows:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTVShows();
  }, [page, sortBy]);

  const handleTVClick = (tvId) => {
    navigate(`/tv/${tvId}`);
  };

  return (
    <div className="tv-list-page">
      <Header />
      <div className="tv-content">
        <h1>TV 시리즈</h1>
        
        <div className="sort-buttons">
          <button 
            className={sortBy === 'popular' ? 'active' : ''}
            onClick={() => setSortBy('popular')}
          >
            인기순
          </button>
          <button 
            className={sortBy === 'top_rated' ? 'active' : ''}
            onClick={() => setSortBy('top_rated')}
          >
            평점순
          </button>
        </div>

        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : (
          <div className="tv-grid">
            {tvShows.map((tv) => (
              <div 
                key={tv.id} 
                className="tv-card"
                onClick={() => handleTVClick(tv.id)}
              >
                <div className="tv-poster">
                  {tv.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                      alt={tv.name}
                    />
                  ) : (
                    <div className="no-poster">이미지 없음</div>
                  )}
                </div>
                <div className="tv-info">
                  <h3>{tv.name}</h3>
                  <p className="tv-date">
                    {tv.first_air_date ? tv.first_air_date.substring(0, 4) : 'N/A'}
                  </p>
                  <p className="tv-rating">⭐ {tv.vote_average?.toFixed(1) || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pagination">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </button>
          <span>페이지 {page}</span>
          <button onClick={() => setPage(p => p + 1)}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

export default TVListPage;
