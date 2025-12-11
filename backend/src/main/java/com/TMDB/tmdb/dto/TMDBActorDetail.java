package com.TMDB.tmdb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TMDBActorDetail {
    private Integer id;
    private String name;
    private String biography;
    private LocalDate birthday;
    private String place_of_birth;
    private String profile_path;
    private Double popularity;
    private String known_for_department;
}
