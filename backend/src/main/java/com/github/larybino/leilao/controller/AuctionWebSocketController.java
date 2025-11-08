package com.github.larybino.leilao.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.github.larybino.leilao.model.Auction;
import com.github.larybino.leilao.model.Bid;
import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.repository.AuctionRepository;
import com.github.larybino.leilao.repository.BidRepository;
import com.github.larybino.leilao.repository.PersonRepository;
import com.github.larybino.leilao.exception.BusinessException;
import com.github.larybino.leilao.model.dto.BidMessageRequest;
import com.github.larybino.leilao.model.dto.BidMessageReponse;
import com.github.larybino.leilao.security.JwtService;


@Controller
public class AuctionWebSocketController {

    @Autowired
    private BidRepository bidRepository;
    @Autowired
    private AuctionRepository auctionRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private JwtService jwtService; 

    @MessageMapping("/bid/{auctionId}") 
    @SendTo("/topic/auction/{auctionId}") 
    public BidMessageReponse handleBid(BidMessageRequest bidMessage) {
        
        String userEmail = jwtService.extractUsername(bidMessage.getUserToken());
        Person bidder = personRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado."));

        Auction auction = auctionRepository.findById(bidMessage.getAuctionId())
                .orElseThrow(() -> new BusinessException("Leilão não encontrado."));

        if (auction.getSeller().getId().equals(bidder.getId())) {
            throw new BusinessException("Você não pode dar lances no seu próprio leilão.");
        }
        
        Float currentHighestBid = bidRepository.findHighestBidAmount(auction.getId())
                .orElse(auction.getMinBid());

        Float newBidAmount = currentHighestBid + auction.getIncrementValue();

        Bid newBid = new Bid();
        newBid.setAuction(auction);
        newBid.setPerson(bidder);
        newBid.setAmount(newBidAmount);
        bidRepository.save(newBid);

        return new BidMessageReponse(auction.getId(), bidder.getEmail(), newBid.getAmount());
    }
    
    @MessageExceptionHandler
    @SendToUser("/topic/errors")
    public String handleException(BusinessException exception) {
        return exception.getMessage();
    }
}