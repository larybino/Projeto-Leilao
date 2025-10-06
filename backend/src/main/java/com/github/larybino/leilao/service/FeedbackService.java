package com.github.larybino.leilao.service;

import com.github.larybino.leilao.enums.StatusAuction;
import com.github.larybino.leilao.exception.BusinessException;
import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Auction;
import com.github.larybino.leilao.model.Feedback;
import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.model.dto.FeedbackCreateDTO;
import com.github.larybino.leilao.repository.AuctionRepository;
import com.github.larybino.leilao.repository.FeedbackRepository;
import com.github.larybino.leilao.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private AuctionRepository auctionRepository;
    @Autowired
    private PersonRepository personRepository; 

    public Feedback createFeedback(Long auctionId, FeedbackCreateDTO dto, Person author) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new NotFoundException("Leilão não encontrado."));

        if (auction.getStatus() != StatusAuction.CLOSED) {
            throw new BusinessException("Você só pode dar feedback em leilões encerrados.");
        }

        if (auction.getWinner() == null || !auction.getWinner().getId().equals(author.getId())) {
            throw new BusinessException("Apenas o vencedor do leilão pode deixar um feedback.");
        }

        if (feedbackRepository.existsByAuctionIdAndAuthorId(auctionId, author.getId())) {
            throw new BusinessException("Você já deixou um feedback para este leilão.");
        }

        Feedback feedback = new Feedback();
        feedback.setAuction(auction);
        feedback.setAuthor(author);
        feedback.setRecipient(auction.getSeller());
        feedback.setRating(dto.getRating());
        feedback.setComment(dto.getComment());

        return feedbackRepository.save(feedback);
    }

    public Page<Feedback> getFeedbacksForUser(Long recipientId, Pageable pageable) {
        personRepository.findById(recipientId)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado."));
        
        return feedbackRepository.findByRecipientId(recipientId, pageable);
    }
}