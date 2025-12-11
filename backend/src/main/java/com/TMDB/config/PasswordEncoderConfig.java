package com.TMDB.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 비밀번호 암호화를 위한 설정
 * 
 * TODO: UserAuthService에서 사용할 수 있도록 구현 필요
 * 
 * 사용 예시:
 * 1. 회원가입 시: String encodedPassword = passwordEncoder.encode(rawPassword);
 * 2. 로그인 시: boolean matches = passwordEncoder.matches(rawPassword,
 * encodedPassword);
 */
@Configuration
public class PasswordEncoderConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
