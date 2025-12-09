package com.lottery.review.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.lottery.review.dto.ReplyDTO;

import java.util.List;

@Mapper
public interface ReplyMapper {
    // 댓글 목록
	List<ReplyDTO> selectReplyList(int boardNo);
    // 댓글 작성
    int insertReply(ReplyDTO reply);
	}    
