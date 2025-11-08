package com.github.larybino.leilao.model.dto;

import lombok.Data;

@Data
 public class BidMessageRequest {
    private Long auctionId;
    private String userToken;
}