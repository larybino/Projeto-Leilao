package com.github.larybino.leilao.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "auctions")
@Data
public class Auction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String detailsDescription;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private StatusAuction status;
    private String obs;
    private Float incrementValue;
    private Float minBid;
}
