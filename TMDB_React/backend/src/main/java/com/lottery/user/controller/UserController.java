package com.lottery.user.controller;

import com.lottery.user.domain.User;
import com.lottery.user.dto.LoginRequest;
import com.lottery.user.dto.FindPasswordRequest;
import com.lottery.user.service.UserAuthService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserAuthService userAuthService;

    // 회원가입
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> res = new HashMap<>();
        boolean ok = userAuthService.register(user);
        res.put("success", ok);
        res.put("message", ok ? "회원가입 성공" : "이미 존재하는 이메일");
        return res;
    }

    // 로그인
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest req, HttpSession session) {
        Map<String, Object> res = new HashMap<>();
        return userAuthService.login(req.getEmail(), req.getPassword())
                .map(u -> {
                    session.setAttribute("user", u);
                    res.put("success", true);
                    res.put("user", u);
                    return res;
                })
                .orElseGet(() -> {
                    res.put("success", false);
                    res.put("message", "이메일 또는 비밀번호가 틀립니다.");
                    return res;
                });
    }

    // 로그아웃
    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.invalidate();
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "로그아웃 성공");
        return res;
    }

    // 로그인 상태 확인
    @GetMapping("/me")
    public Map<String, Object> me(HttpSession session) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) session.getAttribute("user");
        if (user != null) {
            res.put("loggedIn", true);
            res.put("user", user);
        } else {
            res.put("loggedIn", false);
        }
        return res;
    }

    // 비밀번호 찾기
    @PostMapping("/find-password")
    public Map<String, Object> findPassword(@RequestBody FindPasswordRequest req) {
        Map<String, Object> res = new HashMap<>();
        return userAuthService.findPassword(req.getName(), req.getEmail())
                .map(u -> {
                    res.put("success", true);
                    res.put("password", u.getPassword());
                    return res;
                })
                .orElseGet(() -> {
                    res.put("success", false);
                    res.put("message", "입력하신 이름과 이메일에 해당하는 계정을 찾을 수 없습니다.");
                    return res;
                });
    }
}
