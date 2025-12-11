package com.TMDB.tmdb.service;

import com.TMDB.tmdb.dto.TMDBActorDetail;
import com.TMDB.tmdb.dto.TMDBMovieResponse;
import com.TMDB.tmdb.dto.TMDBTVResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
public class TMDBActorService {

    private final RestTemplate restTemplate;

    @Value("${tmdb.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://api.themoviedb.org/3";

    /**
     * 배우 상세 정보 조회
     */
    public TMDBActorDetail getActorDetails(Integer actorId) {
        String url = BASE_URL + "/person/" + actorId + "?api_key=" + apiKey + "&language=ko-KR";
        log.info("Fetching actor details for ID {} from: {}", actorId, url);
        return restTemplate.getForObject(url, TMDBActorDetail.class);
    }

    /**
     * 배우가 출연한 영화 목록 조회
     */
    public TMDBMovieResponse getActorMovies(Integer actorId) {
        String url = BASE_URL + "/person/" + actorId + "/movie_credits?api_key=" + apiKey + "&language=ko-KR";
        log.info("Fetching movies for actor ID {} from: {}", actorId, url);
        return restTemplate.getForObject(url, TMDBMovieResponse.class);
    }

    /**
     * 배우가 출연한 TV 시리즈 목록 조회
     */
    public TMDBTVResponse getActorTVShows(Integer actorId) {
        String url = BASE_URL + "/person/" + actorId + "/tv_credits?api_key=" + apiKey + "&language=ko-KR";
        log.info("Fetching TV shows for actor ID {} from: {}", actorId, url);
        return restTemplate.getForObject(url, TMDBTVResponse.class);
    }
}
