import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTVShowDetails } from '../api/tvApi';
import Header from '../components/common/Header';
import './TVDetailPage.css';

function TVDetailPage() {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTVShowDetails = async () => {
      setLoading(true);
      try {
        const data = await getTVShowDetails(id);
        setTvShow(data);
      } catch (error) {
        console.error('Error loading TV show details:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTVShowDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="tv-detail-page">
        <Header />
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (!tvShow) {
    return (
      <div className="tv-detail-page">
        <Header />
        <div className="error">TV 시리즈를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="tv-detail-page">
      <Header />
      
      <div className="tv-detail-content">
        <button className="back-button" onClick={() => navigate('/tv')}>
          ← 목록으로
        </button>

        <div className="tv-header">
          <div className="tv-poster-large">
            {tvShow.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                alt={tvShow.name}
              />
            ) : (
              <div className="no-poster">이미지 없음</div>
            )}
          </div>

          <div className="tv-details">
            <h1>{tvShow.name}</h1>
            
            <div className="tv-meta">
              <span className="tv-date">
                {tvShow.first_air_date ? tvShow.first_air_date.substring(0, 4) : 'N/A'}
              </span>
              <span className="tv-rating">
                ⭐ {tvShow.vote_average?.toFixed(1) || 'N/A'} ({tvShow.vote_count} votes)
              </span>
            </div>

            <div className="tv-stats">
              <div className="stat-item">
                <span className="stat-label">시즌 수</span>
                <span className="stat-value">{tvShow.number_of_seasons || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">에피소드 수</span>
                <span className="stat-value">{tvShow.number_of_episodes || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">상태</span>
                <span className="stat-value">{tvShow.status || 'N/A'}</span>
              </div>
            </div>

            <div className="tv-overview">
              <h2>줄거리</h2>
              <p>{tvShow.overview || '줄거리 정보가 없습니다.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TVDetailPage;
