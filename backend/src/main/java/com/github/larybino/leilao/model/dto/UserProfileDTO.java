package com.github.larybino.leilao.model.dto;

import java.util.List;

import lombok.Data;

@Data
public class UserProfileDTO {
    private Long id;
    private String name;
    private String email;
    private Double averageRating;
    private Integer feedbackCount;
    private List<String> roles;
}