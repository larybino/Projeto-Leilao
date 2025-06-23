package com.github.larybino.leilao.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class ErrorResponse {
    private LocalDateTime dateTime;
    private int status;
    private String error;
    private String message;
    private String path;
    private List<String> details;
}
