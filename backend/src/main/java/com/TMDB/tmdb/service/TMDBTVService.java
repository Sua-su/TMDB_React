package com.TMDB.tmdb.service;

import com.TMDB.tmdb.dto.TMDBTVResponse;
import com.TMDB.tmdb.dto.TMDBTVDetail;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
public class TMDBTVService {

    private final RestTemplate restTemplate;

    @Value("${tmdb.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://api.themoviedb.org/3";

    public TMDBTVResponse getPopularTVShows(int page) {
        String url = BASE_URL + "/tv/popular?api_key=" + apiKey + "&language=ko-KR&page=" + page;
        log.info("Fetching popular TV shows from: {}", url);
        return restTemplate.getForObject(url, TMDBTVResponse.class);
    }

    public TMDBTVResponse getTopRatedTVShows(int page) {
        String url = BASE_URL + "/tv/top_rated?api_key=" + apiKey + "&language=ko-KR&page=" + page;
        log.info("Fetching top rated TV shows from: {}", url);
        return restTemplate.getForObject(url, TMDBTVResponse.class);
    }

    public TMDBTVResponse searchTVShows(String query, int page) {
        String url = BASE_URL + "/search/tv?api_key=" + apiKey + "&language=ko-KR&query=" + query + "&page=" + page;
        log.info("Searching TV shows with query '{}' from: {}", query, url);
        return restTemplate.getForObject(url, TMDBTVResponse.class);
    }

    public TMDBTVDetail getTVShowDetails(Integer tvId) {
        String url = BASE_URL + "/tv/" + tvId + "?api_key=" + apiKey + "&language=ko-KR";
        log.info("Fetching TV show details for ID {} from: {}", tvId, url);
        return restTemplate.getForObject(url, TMDBTVDetail.class);
    }
}
