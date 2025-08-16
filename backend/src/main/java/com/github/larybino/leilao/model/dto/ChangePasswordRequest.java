package com.github.larybino.leilao.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
