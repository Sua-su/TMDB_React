package com.lottery.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 끄기
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // 모든 요청 허용
            )
            .formLogin(form -> form.disable()); // 기본 로그인 비활성화

        System.out.println("✅ [SecurityConfig] 필터 체인 적용 완료"); // 콘솔 확인용
        return http.build();
    }
}