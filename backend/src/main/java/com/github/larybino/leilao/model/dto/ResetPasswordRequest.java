package com.github.larybino.leilao.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ResetPasswordRequest {
    private String code;
    private String newPassword;
}
