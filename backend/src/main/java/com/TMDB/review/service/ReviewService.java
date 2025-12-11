package com.TMDB.review.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.TMDB.review.dto.ReviewDTO;
import com.TMDB.review.mapper.ReviewMapper;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewMapper reviewMapper;

    /**
     * 1. 리뷰 전체 목록 가져오기
     * (기존 영화별 조회에서 전체 조회로 변경됨)
     */
    public List<ReviewDTO> getAllReviews() {
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
    public ReviewDTO registerReview(ReviewDTO review) {
        reviewMapper.insertReview(review);
        return review;
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

    /**
     * 6. 특정 영화에 대한 리뷰 목록 조회 (추가)
     */
    public List<ReviewDTO> getReviewsByMovieId(int mvNo) {
        return reviewMapper.selectReviewsByMovieId(mvNo);
    }
}