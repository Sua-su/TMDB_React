package com.TMDB.movie.controller;

import com.TMDB.movie.domain.Movie;
import com.TMDB.movie.service.MovieService;
import com.TMDB.tmdb.dto.TMDBMovieResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<?> getAllMovies(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "popular") String sort) {
        try {
            if ("popular".equals(sort)) {
                TMDBMovieResponse response = movieService.getPopularMovies(page);
                return ResponseEntity.ok(response);
            } else if ("top_rated".equals(sort)) {
                TMDBMovieResponse response = movieService.getTopRatedMovies(page);
                return ResponseEntity.ok(response);
            } else if ("name".equals(sort)) {
                TMDBMovieResponse response = movieService.getMoviesByName(page);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Invalid sort parameter");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching movies: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchMovies(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        try {
            TMDBMovieResponse response = movieService.searchMovies(query, page);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error searching movies: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Integer id) {
        try {
            Movie movie = movieService.getMovieByTmdbId(id);
            if (movie != null) {
                return ResponseEntity.ok(movie);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching movie: " + e.getMessage());
        }
    }
}
