package com.TMDB.tmdb.dto;

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
public class TMDBTVShow {
    private Integer id;
    private String name;
    private String original_name;
    private String overview;
    private String poster_path;
    private String backdrop_path;
    private LocalDate first_air_date;
    private Double vote_average;
    private Integer vote_count;
    private Double popularity;
    private String original_language;
    private List<Integer> genre_ids;
}
