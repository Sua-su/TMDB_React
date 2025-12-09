package com.lottery.review.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.lottery.review.dto.ReviewDTO;
import java.util.List;

@Mapper
public interface ReviewMapper {

    // 1. 전체 리뷰 목록 조회 (추가됨)
    // (서비스단의 getReviewList()와 연결됩니다)
    List<ReviewDTO> selectReviewList();

    // 2. 리뷰 작성
    int insertReview(ReviewDTO review);

    // 3. 리뷰 상세 조회
    ReviewDTO selectReviewDetail(int boardNo);
    
    // 4. 리뷰 수정
    int updateReview(ReviewDTO review);

    // 5. 리뷰 삭제
    int deleteReview(int boardNo);
}