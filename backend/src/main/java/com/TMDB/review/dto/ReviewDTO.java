package com.TMDB.review.dto;

import lombok.Data;

@Data
public class ReviewDTO {
    private int boardNo; // 게시글 번호
    private String memberId; // 작성자 ID
    private String boardTitle; // 제목
    private String boardContent;// 내용
    private int mvNo; // 영화 번호 (TMDB ID 등)
    private String regDate; // 작성일
    private String movieTitle; // 영화 제목 (추가)
}