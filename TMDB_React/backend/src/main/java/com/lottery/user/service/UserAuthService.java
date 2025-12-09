package com.lottery.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.lottery.user.domain.User;
import com.lottery.user.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserAuthService {
    private final UserRepository userRepository;

    public boolean register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return false;
        }
        userRepository.save(user);
        return true;
    }

    public Optional<User> login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password));
    }

    public Optional<User> findPassword(String name, String email) {
        return userRepository.findByNameAndEmail(name, email);
    }
}
