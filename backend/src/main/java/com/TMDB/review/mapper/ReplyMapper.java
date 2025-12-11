package com.TMDB.review.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.TMDB.review.dto.ReplyDTO;

import java.util.List;

@Mapper
public interface ReplyMapper {
    // 댓글 목록
    List<ReplyDTO> selectReplyList(int boardNo);

    // 댓글 작성
    int insertReply(ReplyDTO reply);
}
