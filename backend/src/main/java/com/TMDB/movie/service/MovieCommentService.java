package com.TMDB.movie.service;

import com.TMDB.movie.domain.MovieComment;
import com.TMDB.movie.repository.MovieCommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MovieCommentService {

    private final MovieCommentRepository movieCommentRepository;

    public List<MovieComment> getCommentsByMovieId(Long movieId) {
        return movieCommentRepository.findByMovieIdOrderByCreatedAtDesc(movieId);
    }

    public List<MovieComment> getCommentsByUserId(Long userId) {
        return movieCommentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public MovieComment createComment(MovieComment comment) {
        if (comment.getLikes() == null) {
            comment.setLikes(0);
        }
        return movieCommentRepository.save(comment);
    }

    @Transactional
    public void likeComment(Long commentId) {
        MovieComment comment = movieCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        comment.setLikes(comment.getLikes() + 1);
        movieCommentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        MovieComment comment = movieCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("본인의 댓글만 삭제할 수 있습니다.");
        }

        movieCommentRepository.delete(comment);
    }
}