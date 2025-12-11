import React from "react";
import MovieCard from "./MovieCard";

/**
 * Component for rendering a list of movies.
 * @param {Array} movies - The list of movies to render.
 * @returns {JSX.Element} - MovieList component.
 */
function MovieList({ movies }) {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2">
      {movies.map((movie) => {
        return (
          movie.title &&
          movie.overview &&
          movie.poster_path &&
          movie.release_date && <MovieCard key={movie.id} movie={movie} />
        );
      })}
    </div>
  );
}

export default MovieList;
