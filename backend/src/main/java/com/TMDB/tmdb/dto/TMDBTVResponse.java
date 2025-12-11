package com.TMDB.tmdb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TMDBTVResponse {
    private Integer page;
    private List<TMDBTVShow> results;
    private Integer total_pages;
    private Integer total_results;
}
