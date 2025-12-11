package com.TMDB.review.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.TMDB.review.dto.ReplyDTO;
import com.TMDB.review.mapper.ReplyMapper;

import java.util.List;

@RestController
@RequestMapping("/api/reply")
public class ReplyController {

    @Autowired
    private ReplyMapper replyMapper;

    @GetMapping("/list/{boardNo}")
    public List<ReplyDTO> getReplyList(@PathVariable int boardNo) {
        return replyMapper.selectReplyList(boardNo);
    }

    @PostMapping("/write")
    public String writeReply(@RequestBody ReplyDTO reply) {
        // 값이 안 넘어올 경우를 대비한 방어 코드 (기본값 GOOD)
        if (reply.getEvaluation() == null) {
            reply.setEvaluation("GOOD");
        }
        replyMapper.insertReply(reply);
        return "success";
    }
}