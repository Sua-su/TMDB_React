package com.TMDB.tmdb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TMDBTVDetail {
    private Integer id;
    private String name;
    private String overview;
    private String poster_path;
    private String backdrop_path;
    private LocalDate first_air_date;
    private Double vote_average;
    private Integer vote_count;
    private Integer number_of_seasons;
    private Integer number_of_episodes;
    private String status;
    private String original_language;
}
