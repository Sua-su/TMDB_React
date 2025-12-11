package com.TMDB.tmdb.controller;

import com.TMDB.tmdb.dto.TMDBTVResponse;
import com.TMDB.tmdb.dto.TMDBTVDetail;
import com.TMDB.tmdb.service.TMDBTVService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tv")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TVController {

    private final TMDBTVService tvService;

    @GetMapping
    public ResponseEntity<?> getAllTVShows(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "popular") String sort) {
        try {
            if ("popular".equals(sort)) {
                TMDBTVResponse response = tvService.getPopularTVShows(page);
                return ResponseEntity.ok(response);
            } else if ("top_rated".equals(sort)) {
                TMDBTVResponse response = tvService.getTopRatedTVShows(page);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Invalid sort parameter");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching TV shows: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchTVShows(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        try {
            TMDBTVResponse response = tvService.searchTVShows(query, page);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error searching TV shows: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTVShowById(@PathVariable Integer id) {
        try {
            TMDBTVDetail tvShow = tvService.getTVShowDetails(id);
            if (tvShow != null) {
                return ResponseEntity.ok(tvShow);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching TV show: " + e.getMessage());
        }
    }
}
