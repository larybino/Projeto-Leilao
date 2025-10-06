package com.github.larybino.leilao.model.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FeedbackCreateDTO {
    @NotNull(message = "A nota é obrigatória.")
    @Min(1)
    @Max(5)
    private Integer rating;

    @Size(max = 1000, message = "O comentário não pode exceder 1000 caracteres.")
    private String comment;
}