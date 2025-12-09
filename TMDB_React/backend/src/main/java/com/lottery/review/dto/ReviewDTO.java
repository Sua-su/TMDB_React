package com.lottery.review.dto;

import lombok.Data;
import java.util.Date;

@Data
public class ReviewDTO {
    private int boardNo;        // 게시글 번호
    private String memberId;    // 작성자 ID
    private String boardTitle;  // 제목
    private String boardContent;// 내용
    private int mvNo;           // 영화 번호 (TMDB ID 등)
    private Date regDate;       // 작성일
}