package com.github.larybino.leilao.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.larybino.leilao.model.Img;

public interface ImgRepository extends JpaRepository<Img, Long> {
    List<Img> findByAuctionId(Long auctionId);

}
