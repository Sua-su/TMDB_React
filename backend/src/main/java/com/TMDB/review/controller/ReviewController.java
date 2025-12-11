package com.TMDB.review.controller;

import com.TMDB.common.ApiResponse;
import com.TMDB.review.dto.ReviewDTO;
import com.TMDB.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<ApiResponse<java.util.List<ReviewDTO>>> getAllReviews() {
        try {
            var reviews = reviewService.getAllReviews();
            return ResponseEntity.ok(ApiResponse.success("리뷰 목록 조회 성공", reviews));
        } catch (Exception e) {
            log.error("Error fetching reviews", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("리뷰 목록 조회 실패"));
        }
    }

    @GetMapping("/{boardNo}")
    public ResponseEntity<ApiResponse<ReviewDTO>> getReview(@PathVariable int boardNo) {
        try {
            var review = reviewService.getReviewDetail(boardNo);
            return review != null
                    ? ResponseEntity.ok(ApiResponse.success("리뷰 조회 성공", review))
                    : ResponseEntity.status(404).body(ApiResponse.error("리뷰를 찾을 수 없습니다."));
        } catch (Exception e) {
            log.error("Error fetching review", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("리뷰 조회 실패"));
        }
    }

    @PostMapping("/write")
    public ResponseEntity<ApiResponse<ReviewDTO>> writeReview(@RequestBody ReviewDTO review) {
        try {
            ReviewDTO newReview = reviewService.registerReview(review);
            return ResponseEntity.ok(ApiResponse.success("리뷰가 등록되었습니다.", newReview));
        } catch (Exception e) {
            log.error("Error writing review", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("리뷰 등록 실패: " + e.getMessage()));
        }
    }

    @PutMapping("/edit/{boardNo}")
    public ResponseEntity<ApiResponse<ReviewDTO>> editReview(
            @PathVariable int boardNo,
            @RequestBody ReviewDTO review) {
        try {
            review.setBoardNo(boardNo);
            boolean updated = reviewService.modifyReview(review);
            if (updated) {
                ReviewDTO updatedReview = reviewService.getReviewDetail(boardNo);
                return ResponseEntity.ok(ApiResponse.success("리뷰가 수정되었습니다.", updatedReview));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("리뷰 수정 실패"));
            }
        } catch (Exception e) {
            log.error("Error updating review", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("리뷰 수정 실패: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{boardNo}")
    public ResponseEntity<ApiResponse<String>> deleteReview(@PathVariable int boardNo) {
        try {
            boolean deleted = reviewService.removeReview(boardNo);
            if (deleted) {
                return ResponseEntity.ok(ApiResponse.success("리뷰가 삭제되었습니다."));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("리뷰 삭제 실패"));
            }
        } catch (Exception e) {
            log.error("Error deleting review", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("리뷰 삭제 실패: " + e.getMessage()));
        }
    }
}