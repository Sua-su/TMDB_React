package com.TMDB.app;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(scanBasePackages = "com.TMDB")
@MapperScan(basePackages = "com.TMDB.**.mapper")
@EnableJpaRepositories(basePackages = "com.TMDB.**.repository")
@EntityScan(basePackages = "com.TMDB.**.domain")
public class TMDBApplication {
    public static void main(String[] args) {
        SpringApplication.run(TMDBApplication.class, args);
    }
}