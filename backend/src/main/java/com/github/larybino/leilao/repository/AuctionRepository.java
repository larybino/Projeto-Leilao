package com.github.larybino.leilao.repository;

import com.github.larybino.leilao.model.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AuctionRepository extends JpaRepository<Auction, Long>, JpaSpecificationExecutor<Auction> {
    long countByCategoryId(Long categoryId);
}
