package com.TMDB.movie.repository;

import com.TMDB.movie.domain.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByTmdbId(Integer tmdbId);
    boolean existsByTmdbId(Integer tmdbId);
    List<Movie> findAllByOrderByTitleAsc();
}
