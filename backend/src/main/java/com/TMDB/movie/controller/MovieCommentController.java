package com.TMDB.movie.controller;

import com.TMDB.movie.domain.MovieComment;
import com.TMDB.movie.service.MovieCommentService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MovieCommentController {

    private final MovieCommentService movieCommentService;

    @GetMapping("/comments/user")
    public ResponseEntity<?> getUserComments(HttpSession session) {
        try {
            Object userObj = session.getAttribute("user");
            if (userObj == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "로그인이 필요합니다.");
                return ResponseEntity.status(401).body(error);
            }

            com.TMDB.user.domain.User user = (com.TMDB.user.domain.User) userObj;
            List<MovieComment> comments = movieCommentService.getCommentsByUserId(user.getId());
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            log.error("Error fetching user comments", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "댓글을 불러오는데 실패했습니다.");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/{movieId}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long movieId) {
        try {
            List<MovieComment> comments = movieCommentService.getCommentsByMovieId(movieId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            log.error("Error fetching comments for movie {}", movieId, e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "댓글을 불러오는데 실패했습니다.");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @PostMapping("/{movieId}/comments")
    public ResponseEntity<?> createComment(
            @PathVariable Long movieId,
            @RequestBody Map<String, String> requestBody,
            HttpSession session) {
        try {
            Object userObj = session.getAttribute("user");
            if (userObj == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "로그인이 필요합니다.");
                return ResponseEntity.status(401).body(error);
            }

            com.TMDB.user.domain.User user = (com.TMDB.user.domain.User) userObj;
            String content = requestBody.get("content");

            if (content == null || content.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "댓글 내용을 입력해주세요.");
                return ResponseEntity.badRequest().body(error);
            }

            MovieComment comment = new MovieComment();
            comment.setMovieId(movieId);
            comment.setUser(user);
            comment.setContent(content);

            MovieComment savedComment = movieCommentService.createComment(comment);
            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            log.error("Error creating comment for movie {}", movieId, e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "댓글 작성에 실패했습니다.");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @PutMapping("/comments/{commentId}/like")
    public ResponseEntity<?> likeComment(@PathVariable Long commentId) {
        try {
            movieCommentService.likeComment(commentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error liking comment {}", commentId, e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "추천에 실패했습니다.");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            HttpSession session) {
        try {
            Object userObj = session.getAttribute("user");
            if (userObj == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "로그인이 필요합니다.");
                return ResponseEntity.status(401).body(error);
            }

            com.TMDB.user.domain.User user = (com.TMDB.user.domain.User) userObj;
            movieCommentService.deleteComment(commentId, user.getId());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.error("Unauthorized delete attempt for comment {}", commentId, e);
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(403).body(error);
        } catch (Exception e) {
            log.error("Error deleting comment {}", commentId, e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "삭제에 실패했습니다.");
            return ResponseEntity.internalServerError().body(error);
        }
    }
}