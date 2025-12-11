package com.TMDB.movie.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "tmdb_id", unique = true)
    private Integer tmdbId;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "overview", columnDefinition = "TEXT")
    private String overview;
    
    @Column(name = "poster_path")
    private String posterPath;
    
    @Column(name = "backdrop_path")
    private String backdropPath;
    
    @Column(name = "release_date")
    private LocalDate releaseDate;
    
    @Column(name = "vote_average")
    private Double voteAverage;
    
    @Column(name = "vote_count")
    private Integer voteCount;
    
    @Column(name = "popularity")
    private Double popularity;
    
    @Column(name = "original_language")
    private String originalLanguage;
    
    @Column(name = "adult")
    private Boolean adult;
    
    @ManyToMany
    @JoinTable(
        name = "movie_genres",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
