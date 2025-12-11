package com.TMDB.tmdb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TMDBMovie {
    @JsonProperty("id")
    private Integer id;

    @JsonProperty("title")
    private String title;

    @JsonProperty("overview")
    private String overview;

    @JsonProperty("poster_path")
    private String posterPath;

    @JsonProperty("backdrop_path")
    private String backdropPath;

    @JsonProperty("release_date")
    private LocalDate releaseDate;

    @JsonProperty("vote_average")
    private Double voteAverage;

    @JsonProperty("vote_count")
    private Integer voteCount;

    @JsonProperty("popularity")
    private Double popularity;

    @JsonProperty("original_language")
    private String originalLanguage;

    @JsonProperty("adult")
    private Boolean adult;

    @JsonProperty("genres")
    private List<TMDBGenre> genres;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TMDBGenre {
        @JsonProperty("id")
        private Integer id;

        @JsonProperty("name")
        private String name;
    }
}