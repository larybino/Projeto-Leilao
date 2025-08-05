package com.github.larybino.leilao.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.larybino.leilao.model.Auction;

public interface AuctionRepository extends JpaRepository<Auction, Long> {
    
}
