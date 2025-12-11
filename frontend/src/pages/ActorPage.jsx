import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActorDetails, getActorMovies, getActorTVShows } from '../api/actorApi';
import Header from '../components/common/Header';
import './ActorPage.css';

function ActorPage() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [activeTab, setActiveTab] = useState('movies'); // 'movies' or 'tv'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadActorData = async () => {
      setLoading(true);
      try {
        const [actorData, moviesData, tvData] = await Promise.all([
          getActorDetails(id),
          getActorMovies(id),
          getActorTVShows(id)
        ]);
        setActor(actorData);
        setMovies(moviesData.cast || []);
        setTvShows(tvData.cast || []);
      } catch (error) {
        console.error('Error loading actor data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadActorData();
  }, [id]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleTVClick = (tvId) => {
    navigate(`/tv/${tvId}`);
  };

  if (loading) {
    return (
      <div className="actor-page">
        <Header />
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="actor-page">
        <Header />
        <div className="error">배우 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="actor-page">
      <Header />
      
      <div className="actor-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>

        <div className="actor-header">
          <div className="actor-profile">
            {actor.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                alt={actor.name}
              />
            ) : (
              <div className="no-profile">이미지 없음</div>
            )}
          </div>

          <div className="actor-info">
            <h1>{actor.name}</h1>
            
            <div className="actor-details-section">
              {actor.birthday && (
                <div className="detail-item">
                  <span className="detail-label">생년월일</span>
                  <span className="detail-value">{actor.birthday}</span>
                </div>
              )}
              {actor.place_of_birth && (
                <div className="detail-item">
                  <span className="detail-label">출생지</span>
                  <span className="detail-value">{actor.place_of_birth}</span>
                </div>
              )}
              {actor.known_for_department && (
                <div className="detail-item">
                  <span className="detail-label">분야</span>
                  <span className="detail-value">{actor.known_for_department}</span>
                </div>
              )}
            </div>

            {actor.biography && (
              <div className="actor-biography">
                <h2>소개</h2>
                <p>{actor.biography}</p>
              </div>
            )}
          </div>
        </div>

        <div className="actor-movies-section">
          <div className="works-header">
            <h2>출연 작품</h2>
            <div className="tab-buttons">
              <button
                className={`tab-button ${activeTab === 'movies' ? 'active' : ''}`}
                onClick={() => setActiveTab('movies')}
              >
                영화 ({movies.length})
              </button>
              <button
                className={`tab-button ${activeTab === 'tv' ? 'active' : ''}`}
                onClick={() => setActiveTab('tv')}
              >
                TV ({tvShows.length})
              </button>
            </div>
          </div>

          {activeTab === 'movies' && (
            <div className="movies-grid">
              {movies.slice(0, 12).map((movie) => (
              <div 
                key={movie.id} 
                className="movie-card"
                onClick={() => handleMovieClick(movie.id)}
              >
                <div className="movie-poster">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  ) : (
                    <div className="no-poster">이미지 없음</div>
                  )}
                </div>
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p className="movie-date">
                    {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
                  </p>
                  {movie.character && (
                    <p className="movie-character">역할: {movie.character}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}

          {activeTab === 'tv' && (
            <div className="movies-grid">
              {tvShows.slice(0, 12).map((tv) => (
                <div 
                  key={tv.id} 
                  className="movie-card"
                  onClick={() => handleTVClick(tv.id)}
                >
                  <div className="movie-poster">
                    {tv.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                        alt={tv.name}
                      />
                    ) : (
                      <div className="no-poster">이미지 없음</div>
                    )}
                  </div>
                  <div className="movie-info">
                    <h3>{tv.name}</h3>
                    <p className="movie-date">
                      {tv.first_air_date ? tv.first_air_date.substring(0, 4) : 'N/A'}
                    </p>
                    {tv.character && (
                      <p className="movie-character">역할: {tv.character}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActorPage;
