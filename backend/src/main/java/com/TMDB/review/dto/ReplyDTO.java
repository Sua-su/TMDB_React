package com.TMDB.review.dto;

import lombok.Data;

@Data
public class ReplyDTO {
    private int replyNo;
    private int boardNo;
    private String memberId;
    private String replyContent;
    private String evaluation; // "GOOD" or "BAD"
    private String regDate;
}