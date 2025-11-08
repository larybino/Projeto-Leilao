package com.github.larybino.leilao.model;

import java.util.Date;
import java.util.List;

import com.github.larybino.leilao.enums.StatusAuction;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Entity
@Table(name = "auctions")
@Data
public class Auction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título é obrigatório")
    private String title;

    @NotBlank(message = "A descrição é obrigatória")
    private String description;
    
    private String detailsDescription;

    @NotNull(message = "A data de início é obrigatória")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;

    @NotNull(message = "A data de término é obrigatória")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;

    @Enumerated(EnumType.STRING)
    private StatusAuction status;
    
    private String obs;

    @NotNull(message = "O valor de incremento é obrigatório")
    @Positive(message = "O valor de incremento deve ser positivo")
    private Float incrementValue;

    @NotNull(message = "O lance mínimo é obrigatório")
    @Positive(message = "O lance mínimo deve ser positivo")
    private Float minBid;

    @NotNull(message = "A categoria é obrigatória")
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private Person seller; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id")
    private Person winner;

    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Img> images;
    private String emailUserBid;

    @OneToMany(mappedBy = "auction")
    @OrderBy("amount DESC") 
    private List<Bid> bids;
}