package hac.controller;

import hac.entity.MovieReview;
import hac.entity.User;
import hac.repo.MovieReviewRepository;
import hac.repo.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class MovieReviewController {

    @Autowired
    private MovieReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<MovieReview>> getReviewsByMovie(@PathVariable Long movieId) {
        List<MovieReview> reviews = reviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MovieReview>> getReviewsByUser(@PathVariable Long userId) {
        List<MovieReview> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/all")
    public ResponseEntity<List<MovieReview>> getAllReviews() {
        List<MovieReview> reviews = reviewRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReview(@PathVariable Long id) {
        return reviewRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createReview(@Valid @RequestBody MovieReview review) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        review.setUser(user);
        MovieReview savedReview = reviewRepository.save(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @Valid @RequestBody MovieReview updatedReview) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return reviewRepository.findById(id)
                .map(review -> {
                    if (!review.getUser().getUsername().equals(username)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("error", "You can only edit your own reviews"));
                    }

                    review.setContent(updatedReview.getContent());
                    review.setRating(updatedReview.getRating());
                    MovieReview saved = reviewRepository.save(review);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return reviewRepository.findById(id)
                .map(review -> {
                    if (!review.getUser().getUsername().equals(username)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("error", "You can only delete your own reviews"));
                    }

                    reviewRepository.delete(review);
                    return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
