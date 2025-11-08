package com.github.larybino.leilao.repository;

import com.github.larybino.leilao.enums.StatusAuction;
import com.github.larybino.leilao.model.Auction;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AuctionRepository extends JpaRepository<Auction, Long>, JpaSpecificationExecutor<Auction> {
    long countByCategoryId(Long categoryId);
    List<Auction> findByStatusAndStartDateBefore(StatusAuction status, Date now);
    List<Auction> findByStatusAndEndDateBefore(StatusAuction status, Date now);
}
