package com.github.larybino.leilao.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.larybino.leilao.model.Bid;

public interface BidRepository extends JpaRepository<Bid, Long> {
}
