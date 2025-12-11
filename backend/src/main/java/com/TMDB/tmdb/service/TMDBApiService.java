package com.TMDB.tmdb.service;

import com.TMDB.tmdb.dto.TMDBMovie;
import com.TMDB.tmdb.dto.TMDBMovieResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
public class TMDBApiService {
    
    private final RestTemplate restTemplate;
    
    @Value("${tmdb.api.key}")
    private String apiKey;
    
    private final String BASE_URL = "https://api.themoviedb.org/3";
    
    public TMDBMovieResponse getPopularMovies(int page) {
        String url = BASE_URL + "/movie/popular?api_key=" + apiKey + "&language=ko-KR&page=" + page;
        log.info("Fetching popular movies from: {}", url);
        return restTemplate.getForObject(url, TMDBMovieResponse.class);
    }
    
    public TMDBMovieResponse getTopRatedMovies(int page) {
        String url = BASE_URL + "/movie/top_rated?api_key=" + apiKey + "&language=ko-KR&page=" + page;
        log.info("Fetching top rated movies from: {}", url);
        return restTemplate.getForObject(url, TMDBMovieResponse.class);
    }
    
    public TMDBMovieResponse searchMovies(String query, int page) {
        String url = BASE_URL + "/search/movie?api_key=" + apiKey + "&language=ko-KR&query=" + query + "&page=" + page;
        log.info("Searching movies with query '{}' from: {}", query, url);
        return restTemplate.getForObject(url, TMDBMovieResponse.class);
    }
    
    public TMDBMovie getMovieDetails(Integer movieId) {
        String url = BASE_URL + "/movie/" + movieId + "?api_key=" + apiKey + "&language=ko-KR";
        log.info("Fetching movie details for ID {} from: {}", movieId, url);
        return restTemplate.getForObject(url, TMDBMovie.class);
    }
}