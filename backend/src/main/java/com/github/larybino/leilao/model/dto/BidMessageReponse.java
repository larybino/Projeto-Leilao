package com.github.larybino.leilao.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
 public class BidMessageReponse {
    private Long auctionId;
    private String emailUser;
    private Float newValue;
}