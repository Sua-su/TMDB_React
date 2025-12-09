package com.lottery.review.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lottery.review.dto.ReviewDTO;
import com.lottery.review.mapper.ReviewMapper;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewMapper reviewMapper;

    /**
     * 1. 리뷰 전체 목록 가져오기
     * (기존 영화별 조회에서 전체 조회로 변경됨)
     */
    public List<ReviewDTO> getReviewList() {
        return reviewMapper.selectReviewList();
    }

    /**
     * 2. 리뷰 상세 조회
     * (빠져있던 부분 추가됨)
     */
    public ReviewDTO getReviewDetail(int boardNo) {
        return reviewMapper.selectReviewDetail(boardNo);
    }

    /**
     * 3. 리뷰 저장
     */
    public boolean registerReview(ReviewDTO review) {
        int result = reviewMapper.insertReview(review);
        return result == 1; // 1이면 성공, 0이면 실패
    }

    /**
     * 4. 리뷰 수정
     */
    public boolean modifyReview(ReviewDTO review) {
        return reviewMapper.updateReview(review) == 1;
    }
    
    /**
     * 5. 리뷰 삭제
     */
    public boolean removeReview(int boardNo) {
        int result = reviewMapper.deleteReview(boardNo);
        return result == 1;
    }
}