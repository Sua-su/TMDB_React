package com.TMDB.user.repository;

import com.TMDB.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMemberId(String memberId);

    Optional<User> findByNameAndEmail(String name, String email);
}
