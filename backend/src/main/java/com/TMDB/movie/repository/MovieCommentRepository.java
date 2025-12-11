package com.TMDB.movie.repository;

import com.TMDB.movie.domain.MovieComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieCommentRepository extends JpaRepository<MovieComment, Long> {

    @Query("SELECT c FROM MovieComment c WHERE c.movie.id = :movieId ORDER BY c.createdAt DESC")
    List<MovieComment> findByMovieIdOrderByCreatedAtDesc(@Param("movieId") Long movieId);

    @Query("SELECT c FROM MovieComment c WHERE c.user.id = :userId ORDER BY c.createdAt DESC")
    List<MovieComment> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}