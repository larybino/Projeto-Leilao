package com.github.larybino.leilao.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.github.larybino.leilao.model.Auction;
import com.github.larybino.leilao.repository.AuctionRepository;

@Component("auctionSecurity")
public class AuctionSecurity {

    @Autowired
    private AuctionRepository auctionRepository;

    public boolean isOwner(Authentication authentication, Long auctionId) {
        String authenticatedUserEmail = authentication.getName();

        Auction auction = auctionRepository.findById(auctionId).orElse(null);

        if (auction == null || auction.getSeller() == null) {
            return false;
        }

        return authenticatedUserEmail.equals(auction.getSeller().getEmail());
    }
}