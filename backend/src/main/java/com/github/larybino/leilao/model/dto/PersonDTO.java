package com.github.larybino.leilao.model.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonDTO {
    private String name;
    private String email;
    private String password;
    private List<Long> profileIds;
}
