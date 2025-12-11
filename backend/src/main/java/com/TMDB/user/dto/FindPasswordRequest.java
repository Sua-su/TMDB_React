package com.TMDB.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindPasswordRequest {
    private String name;
    private String email;
}
