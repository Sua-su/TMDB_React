package com.TMDB.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.TMDB.user.domain.User;
import com.TMDB.user.repository.UserRepository;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserAuthService {
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Transactional
    public String register(User user) {
        if (userRepository.findByMemberId(user.getMemberId()).isPresent()) {
            log.warn("이미 존재하는 아이디로 회원가입 시도: {}", user.getMemberId());
            return "ID_EXISTS";
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            log.warn("이미 존재하는 이메일로 회원가입 시도: {}", user.getEmail());
            return "EMAIL_EXISTS";
        }
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);
        log.info("회원가입 완료: {} ({})", user.getMemberId(), user.getEmail());
        return "SUCCESS";
    }

    public Optional<User> login(String memberId, String password) {
        return userRepository.findByMemberId(memberId)
                .filter(user -> {
                    // 암호화된 비밀번호와 입력된 비밀번호 비교
                    boolean matches = passwordEncoder.matches(password, user.getPassword());
                    if (matches) {
                        log.info("로그인 성공: {}", memberId);
                    } else {
                        log.warn("로그인 실패 (비밀번호 불일치): {}", memberId);
                    }
                    return matches;
                });
    }

    public Optional<User> findPassword(String name, String email) {
        Optional<User> user = userRepository.findByNameAndEmail(name, email);
        if (user.isPresent()) {
            log.info("비밀번호 찾기 성공: {} ({})", name, email);
            // TODO: 임시 비밀번호 생성 및 이메일 발송 로직 추가 필요
            // String tempPassword = generateTempPassword();
            // user.get().setPassword(passwordEncoder.encode(tempPassword));
            // userRepository.save(user.get());
            // sendEmailWithTempPassword(email, tempPassword);
        } else {
            log.warn("비밀번호 찾기 실패: {} ({})", name, email);
        }
        return user;
    }
}
