package com.TMDB.movie.domain;

import com.TMDB.user.domain.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "movie_comments")
public class MovieComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    @JsonIgnoreProperties({ "comments" })
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({ "password" })
    private User user;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Builder.Default
    @Column(name = "likes", nullable = false)
    private Integer likes = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Helper method to set movieId - improved null safety
    public void setMovieId(Long movieId) {
        if (movieId == null) {
            throw new IllegalArgumentException("Movie ID cannot be null");
        }
        if (this.movie == null) {
            this.movie = Movie.builder().id(movieId).build();
        } else {
            this.movie.setId(movieId);
        }
    }

    // Helper method to set movie entity
    public void setMovieEntity(Movie movie) {
        if (movie == null || movie.getId() == null) {
            throw new IllegalArgumentException("Movie and Movie ID cannot be null");
        }
        this.movie = movie;
    }
}