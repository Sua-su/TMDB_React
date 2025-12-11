package hac.controller;

import hac.entity.Comment;
import hac.entity.MovieReview;
import hac.entity.User;
import hac.repo.CommentRepository;
import hac.repo.MovieReviewRepository;
import hac.repo.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private MovieReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<Comment>> getCommentsByReview(@PathVariable Long reviewId) {
        List<Comment> comments = commentRepository.findByReviewIdOrderByCreatedAtAsc(reviewId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/review/{reviewId}")
    public ResponseEntity<?> createComment(@PathVariable Long reviewId, @Valid @RequestBody Comment comment) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MovieReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        comment.setUser(user);
        comment.setReview(review);
        Comment savedComment = commentRepository.save(comment);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @Valid @RequestBody Comment updatedComment) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return commentRepository.findById(id)
                .map(comment -> {
                    if (!comment.getUser().getUsername().equals(username)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("error", "You can only edit your own comments"));
                    }

                    comment.setContent(updatedComment.getContent());
                    Comment saved = commentRepository.save(comment);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return commentRepository.findById(id)
                .map(comment -> {
                    if (!comment.getUser().getUsername().equals(username)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("error", "You can only delete your own comments"));
                    }

                    commentRepository.delete(comment);
                    return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
