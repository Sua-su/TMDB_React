package com.lottery.app;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(scanBasePackages = "com.lottery")
@MapperScan(basePackages = "com.lottery.**.mapper")
@EnableJpaRepositories(basePackages = "com.lottery.**.repository")
@EntityScan(basePackages = "com.lottery.**.domain")
public class LotteryApplication {
    public static void main(String[] args) {
        SpringApplication.run(LotteryApplication.class, args);
    }
}
