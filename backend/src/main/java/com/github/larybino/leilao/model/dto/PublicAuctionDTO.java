package com.github.larybino.leilao.model.dto;

import lombok.Data;
import java.util.Date;

@Data
public class PublicAuctionDTO {
    private Long id;
    private String title;
    private String categoryName;
    private Date endDate;
    private Float currentPrice;
    private String coverImageUrl;
    private String emailUserBid;
}