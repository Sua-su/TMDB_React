package com.TMDB.tmdb.controller;

import com.TMDB.tmdb.dto.TMDBActorDetail;
import com.TMDB.tmdb.dto.TMDBMovieResponse;
import com.TMDB.tmdb.dto.TMDBTVResponse;
import com.TMDB.tmdb.service.TMDBActorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/actors")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ActorController {

    private final TMDBActorService actorService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getActorById(@PathVariable Integer id) {
        try {
            TMDBActorDetail actor = actorService.getActorDetails(id);
            if (actor != null) {
                return ResponseEntity.ok(actor);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching actor: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/movies")
    public ResponseEntity<?> getActorMovies(@PathVariable Integer id) {
        try {
            TMDBMovieResponse response = actorService.getActorMovies(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching actor movies: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/tv")
    public ResponseEntity<?> getActorTVShows(@PathVariable Integer id) {
        try {
            TMDBTVResponse response = actorService.getActorTVShows(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching actor TV shows: " + e.getMessage());
        }
    }
}
