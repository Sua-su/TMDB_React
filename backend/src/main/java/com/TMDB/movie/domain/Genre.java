package com.TMDB.movie.domain;

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
@Table(name = "genres")
public class Genre {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "tmdb_id", unique = true)
    private Integer tmdbId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}