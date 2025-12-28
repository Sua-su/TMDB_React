package com.TMDB.movie.repository;

import com.TMDB.movie.domain.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    /**
     * TMDB ID로 영화가 이미 존재하는지 확인
     */
    boolean existsByTmdbId(Integer tmdbId);

    /**
     * TMDB ID로 영화 조회
     */
    Optional<Movie> findByTmdbId(Integer tmdbId);

    /**
     * 제목순으로 모든 영화 조회
     */
    List<Movie> findAllByOrderByTitleAsc();

    /**
     * 인기순으로 영화 조회
     */
    List<Movie> findAllByOrderByPopularityDesc();

    /**
     * 평점순으로 영화 조회
     */
    List<Movie> findAllByOrderByVoteAverageDesc();
}
