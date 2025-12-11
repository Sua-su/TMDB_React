package com.TMDB.movie.service;

import com.TMDB.movie.domain.Movie;
import com.TMDB.movie.repository.MovieRepository;
import com.TMDB.tmdb.dto.TMDBMovieResponse;
import com.TMDB.tmdb.service.TMDBApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MovieService {

    private final MovieRepository movieRepository;
    private final TMDBApiService tmdbApiService;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public TMDBMovieResponse getPopularMovies(int page) {
        try {
            TMDBMovieResponse response = tmdbApiService.getPopularMovies(page);
            saveMoviesToDatabase(response.getResults());
            return response;
        } catch (Exception e) {
            log.error("Error fetching popular movies", e);
            throw new RuntimeException("Failed to fetch popular movies", e);
        }
    }

    public TMDBMovieResponse getTopRatedMovies(int page) {
        try {
            TMDBMovieResponse response = tmdbApiService.getTopRatedMovies(page);
            saveMoviesToDatabase(response.getResults());
            return response;
        } catch (Exception e) {
            log.error("Error fetching top rated movies", e);
            throw new RuntimeException("Failed to fetch top rated movies", e);
        }
    }

    public TMDBMovieResponse searchMovies(String query, int page) {
        try {
            TMDBMovieResponse response = tmdbApiService.searchMovies(query, page);
            saveMoviesToDatabase(response.getResults());
            return response;
        } catch (Exception e) {
            log.error("Error searching movies", e);
            throw new RuntimeException("Failed to search movies", e);
        }
    }

    public TMDBMovieResponse getMoviesByName(int page) {
        try {
            List<Movie> movies = movieRepository.findAllByOrderByTitleAsc();
            return TMDBMovieResponse.builder()
                    .page(page)
                    .results(convertToTMDBMovies(movies))
                    .total_pages((int) Math.ceil((double) movies.size() / 20.0))
                    .total_results(movies.size())
                    .build();
        } catch (Exception e) {
            log.error("Error getting movies by name", e);
            throw new RuntimeException("Failed to get movies by name", e);
        }
    }

    private List<com.TMDB.tmdb.dto.TMDBMovie> convertToTMDBMovies(List<Movie> movies) {
        return movies.stream().map(movie -> com.TMDB.tmdb.dto.TMDBMovie.builder()
                .id(movie.getTmdbId())
                .title(movie.getTitle())
                .overview(movie.getOverview())
                .posterPath(movie.getPosterPath())
                .backdropPath(movie.getBackdropPath())
                .releaseDate(movie.getReleaseDate())
                .voteAverage(movie.getVoteAverage())
                .voteCount(movie.getVoteCount())
                .popularity(movie.getPopularity())
                .originalLanguage(movie.getOriginalLanguage())
                .adult(movie.getAdult())
                .build()).collect(Collectors.toList());
    }

    public Movie getMovieByTmdbId(Integer tmdbId) {
        // TMDB ID로 영화를 찾고, 없으면 TMDB API에서 가져와 저장하는 로직 추가
        return movieRepository.findByTmdbId(tmdbId).orElseGet(() -> {
            log.info("로컬 DB에 영화 없음 (TMDB ID: {}). TMDB API에서 조회 및 저장 시도.", tmdbId);
            com.TMDB.tmdb.dto.TMDBMovie tmdbMovie = tmdbApiService.getMovieDetails(tmdbId);
            if (tmdbMovie != null) {
                saveMoviesToDatabase(List.of(tmdbMovie));
                return movieRepository.findByTmdbId(tmdbId).orElse(null);
            }
            return null;
        });
    }

    @Transactional
    private void saveMoviesToDatabase(List<com.TMDB.tmdb.dto.TMDBMovie> tmdbMovies) {
        if (tmdbMovies == null || tmdbMovies.isEmpty()) {
            return;
        }

        for (com.TMDB.tmdb.dto.TMDBMovie tmdbMovie : tmdbMovies) {
            try {
                if (!movieRepository.existsByTmdbId(tmdbMovie.getId())) {
                    Movie movie = Movie.builder()
                            .tmdbId(tmdbMovie.getId())
                            .title(tmdbMovie.getTitle())
                            .overview(tmdbMovie.getOverview())
                            .posterPath(tmdbMovie.getPosterPath())
                            .backdropPath(tmdbMovie.getBackdropPath())
                            .releaseDate(tmdbMovie.getReleaseDate())
                            .voteAverage(tmdbMovie.getVoteAverage())
                            .voteCount(tmdbMovie.getVoteCount())
                            .popularity(tmdbMovie.getPopularity())
                            .originalLanguage(tmdbMovie.getOriginalLanguage())
                            .adult(tmdbMovie.getAdult())
                            .build();
                    movieRepository.save(movie);
                    log.debug("영화 저장 완료: {} (TMDB ID: {})", movie.getTitle(), movie.getTmdbId());
                }
            } catch (Exception e) {
                log.error("영화 저장 실패 (TMDB ID: {}): {}", tmdbMovie.getId(), e.getMessage());
            }
        }
    }
}
