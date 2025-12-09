package com.lottery.review.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.lottery.review.dto.ReviewDTO;
import com.lottery.review.service.ReviewService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/review")
@CrossOrigin(origins = "http://localhost:3000") // React 포트 허용
public class ReviewController {

    @Autowired
    private ReviewService reviewService; // Mapper가 아니라 Service를 주입받습니다.

    /**
     * 1. 리뷰 목록 조회 (GET)
     */
    @GetMapping("/list")
    public List<ReviewDTO> getReviewList() {
        return reviewService.getReviewList();
    }
    /**
     * 2. 리뷰 상세 조회 (GET)
     */
    @GetMapping("/detail/{boardNo}")
    public ReviewDTO getReviewDetail(@PathVariable int boardNo) {
        return reviewService.getReviewDetail(boardNo);
    }

    /**
     * 3. 리뷰 작성 (POST)
     */
    @PostMapping("/write")
    public Map<String, Object> writeReview(@RequestBody ReviewDTO review) {
        Map<String, Object> response = new HashMap<>();
        
        // Service가 boolean을 반환하므로 boolean 변수로 받습니다.
        boolean isSuccess = reviewService.registerReview(review); 
        
        if (isSuccess) {
            response.put("status", "success");
            response.put("message", "리뷰가 등록되었습니다.");
        } else {
            response.put("status", "fail");
            response.put("message", "리뷰 등록 실패");
        }
        return response;
    }

    /**
     * 4. 리뷰 수정 (PUT)
     * - 수정 요청: int result 대신 boolean을 사용합니다.
     */
    @PutMapping("/edit")
    public Map<String, String> editReview(@RequestBody ReviewDTO review) {
        Map<String, String> response = new HashMap<>();

        // Service의 modifyReview는 boolean(true/false)을 반환합니다.
        boolean isSuccess = reviewService.modifyReview(review);

        if (isSuccess) {
            response.put("status", "success");
        } else {
            response.put("status", "fail");
        }
        return response;
    }

    /**
     * 5. 리뷰 삭제 (DELETE)
     */
    @DeleteMapping("/{boardNo}")
    public Map<String, String> deleteReview(@PathVariable int boardNo) {
        Map<String, String> response = new HashMap<>();

        // Service의 removeReview는 boolean(true/false)을 반환합니다.
        boolean isSuccess = reviewService.removeReview(boardNo);

        if (isSuccess) {
             response.put("status", "success");
        } else {
             response.put("status", "fail");
        }
        return response;
    }
}