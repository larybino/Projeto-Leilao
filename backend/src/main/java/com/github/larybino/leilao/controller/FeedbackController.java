package com.github.larybino.leilao.controller;

import com.github.larybino.leilao.model.Feedback;
import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.model.dto.FeedbackCreateDTO;
import com.github.larybino.leilao.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/auctions/{auctionId}/feedback")
    @PreAuthorize("hasAuthority('BUYER')")
    public ResponseEntity<Feedback> createFeedback(
            @PathVariable Long auctionId,
            @Valid @RequestBody FeedbackCreateDTO dto,
            @AuthenticationPrincipal Person author) {
        
        Feedback createdFeedback = feedbackService.createFeedback(auctionId, dto, author);
        return ResponseEntity.ok(createdFeedback);
    }

    @GetMapping("/persons/{personId}/feedbacks")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<Feedback>> getFeedbacksForUser(
            @PathVariable Long personId,
            Pageable pageable) {
        
        Page<Feedback> feedbacks = feedbackService.getFeedbacksForUser(personId, pageable);
        return ResponseEntity.ok(feedbacks);
    }
}