package com.github.larybino.leilao.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.github.larybino.leilao.model.Bid;

public interface BidRepository extends JpaRepository<Bid, Long> {
    @Query("SELECT MAX(b.amount) FROM Bid b WHERE b.auction.id = :auctionId")
    Optional<Float> findHighestBidAmount(@Param("auctionId") Long auctionId);
    Optional<Bid> findTopByAuctionIdOrderByAmountDesc(Long auctionId);
}
