package com.TMDB.auth;

import com.TMDB.user.domain.User;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenStore {

    private final Map<String, User> tokenStore = new ConcurrentHashMap<>();

    /**
     * Generates a new token for the given user and stores it.
     * @param user The user to generate a token for.
     * @return The generated token.
     */
    public String generateToken(User user) {
        String token = UUID.randomUUID().toString();
        tokenStore.put(token, user);
        return token;
    }

    /**
     * Retrieves the user associated with the given token.
     * @param token The token to look up.
     * @return An Optional containing the user if the token is valid, otherwise an empty Optional.
     */
    public Optional<User> getUser(String token) {
        return Optional.ofNullable(tokenStore.get(token));
    }

    /**
     * Invalidates a token.
     * @param token The token to invalidate.
     */
    public void invalidateToken(String token) {
        tokenStore.remove(token);
    }
}
