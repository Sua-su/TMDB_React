package com.TMDB.user.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", unique = true, nullable = false)
    private String memberId;
    
    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;
}
