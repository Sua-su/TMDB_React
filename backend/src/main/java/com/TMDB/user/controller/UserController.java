package com.TMDB.user.controller;

import com.TMDB.auth.TokenStore;
import com.TMDB.common.ApiResponse;
import com.TMDB.user.domain.User;
import com.TMDB.user.dto.FindPasswordRequest;
import com.TMDB.user.dto.LoginRequest;
import com.TMDB.user.service.UserAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserAuthService userAuthService;
    private final TokenStore tokenStore;
    private final com.TMDB.user.repository.UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody User user) {
        try {
            String result = userAuthService.register(user);
            if ("ID_EXISTS".equals(result)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("이미 존재하는 아이디입니다."));
            }
            if ("EMAIL_EXISTS".equals(result)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("이미 존재하는 이메일입니다."));
            }
            return ResponseEntity.ok(ApiResponse.success("회원가입 성공", "회원가입이 완료되었습니다."));
        } catch (Exception e) {
            log.error("Registration failed", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("회원가입 실패: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody LoginRequest req) {
        return userAuthService.login(req.getMemberId(), req.getPassword())
                .map(u -> {
                    String token = tokenStore.generateToken(u);
                    // Create safe user response without password
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("user", Map.of(
                            "id", u.getId(),
                            "memberId", u.getMemberId(),
                            "email", u.getEmail(),
                            "name", u.getName()));

                    return ResponseEntity.ok(ApiResponse.success("로그인 성공", response));
                })
                .orElseGet(() -> ResponseEntity.badRequest().body(ApiResponse.error("로그인 실패")));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                tokenStore.invalidateToken(token);
            }
            return ResponseEntity.ok(ApiResponse.success("로그아웃 성공"));
        } catch (Exception e) {
            log.error("Logout failed", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("로그아웃 실패"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(ApiResponse.error("인증이 필요합니다."));
            }

            String token = authHeader.substring(7);
            return tokenStore.getUser(token)
                    .map(user -> ResponseEntity.ok(ApiResponse.success("사용자 정보 조회 성공", user)))
                    .orElseGet(() -> ResponseEntity.status(401).body(ApiResponse.error("유효하지 않은 토큰입니다.")));
        } catch (Exception e) {
            log.error("Get current user failed", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("사용자 정보 조회 실패"));
        }
    }

    @PostMapping("/find-password")
    public ResponseEntity<ApiResponse<String>> findPassword(@RequestBody FindPasswordRequest req) {
        try {
            // TODO: 임시 비밀번호 생성 및 이메일 발송 로직 추가 필요
            return ResponseEntity.ok(ApiResponse.success("계정을 찾았습니다. 임시 비밀번호가 이메일로 발송되었습니다."));
        } catch (Exception e) {
            log.error("Find password failed", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("비밀번호 찾기 실패"));
        }
    }
}