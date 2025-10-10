package com.github.larybino.leilao.model.dto;

import java.util.Date;
import java.util.List;

import com.github.larybino.leilao.enums.StatusAuction;
import com.github.larybino.leilao.model.Img;

import lombok.Data;

@Data
public class AuctionDetailDTO {
    private Long id;
    private String title;
    private String description;
    private String detailsDescription;
    private StatusAuction status;
    private Date startDate;
    private Date endDate;
    private Float minBid;
    private Float incrementValue;
    private Float currentPrice;
    private String categoryName;
    private List<Img> images;
    private SellerInfoDTO seller;

    @Data
    public static class SellerInfoDTO {
        private Long id;
        private String name;
        private Double averageRating;
        private Integer feedbackCount;
    }
}