package com.github.larybino.leilao.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Auction;
import com.github.larybino.leilao.repository.AuctionRepository;

@Service
public class AuctionService {
    @Autowired
    private AuctionRepository auctionRepository;

    public Auction create(Auction auction) {
        return auctionRepository.save(auction);
    }

    public Auction findById(Long id) {
        return auctionRepository.findById(id).orElseThrow(() -> new NotFoundException("Auction not found with id: " + id));
    }

    public Auction update(Auction auction) {
        Auction existingAuction = findById(auction.getId());
        if (existingAuction != null) {
            existingAuction.setTitle(auction.getTitle());
            existingAuction.setDescription(auction.getDescription());
            existingAuction.setStartDate(auction.getStartDate());
            existingAuction.setEndDate(auction.getEndDate());
            existingAuction.setStatus(auction.getStatus());
            return auctionRepository.save(existingAuction);
        }
        throw new NotFoundException("Auction not found with id: " + auction.getId());
    }

    public void delete(Long id) {
        Auction existingAuction = findById(id);
        auctionRepository.delete(existingAuction);
    }  

    public Page<Auction> findAll(Pageable pageable) {
        return auctionRepository.findAll(pageable);
    }
            
}
