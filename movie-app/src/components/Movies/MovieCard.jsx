import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Component for rendering a movie card.
 * @param {Object} movie - The movie object.
 * @returns {JSX.Element} - MovieCard component.
 */
const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const RELEASE_DATE_NOT_AVAILABLE = "Release date not available";
  const OVERVIEW_NOT_AVAILABLE = "Overview not available";
  const TITLE_NOT_AVAILABLE = "Title not available";
  const IMAGE_NOT_AVAILABLE = "Image not available";
  const IMG_PATH = "https://image.tmdb.org/t/p/w500";

  /**
   * Handles the mouse enter event.
   */
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  /**
   * Handles the mouse leave event.
   */
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  /**
   * Renders the movie image.
   * @returns {JSX.Element} - The rendered image element.
   */
  const renderImage = () => {
    if (movie.poster_path) {
      return (
        <img
          src={`${IMG_PATH}${movie.poster_path}`}
          className="movie-card-img-top img-fluid"
          alt={movie.title || TITLE_NOT_AVAILABLE}
        />
      );
    }
    return <div className="missing-image">{IMAGE_NOT_AVAILABLE}</div>;
  };

  /**
   * Renders the content to be displayed when the card is hovered.
   * @returns {JSX.Element} - The rendered hovered content.
   */
  const renderHoveredContent = () => (
    <div>
      <p className="movie-card-text">
        {movie.release_date || RELEASE_DATE_NOT_AVAILABLE}
      </p>
      <div
        className="movie-card-text overflow-auto"
        style={{ maxHeight: "180px" }}
      >
        {movie.overview || OVERVIEW_NOT_AVAILABLE}
      </div>
    </div>
  );

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      className="col mb-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="card h-100 d-flex flex-column text-light">
        <div className="card-body bg-dark d-flex flex-column">
          {isHovered ? renderHoveredContent() : renderImage()}
          <div className="row flex-grow-1">
            <div className="col d-flex align-items-center">
              <h6 className="card-title">
                {movie.title || movie.name || TITLE_NOT_AVAILABLE}
              </h6>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex align-items-center">
              <span className="badge bg-warning text-dark">
                ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
              </span>
            </div>
            <div className="col d-flex align-items-center justify-content-end">
              <button className="btn btn-sm btn-primary">상세보기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
