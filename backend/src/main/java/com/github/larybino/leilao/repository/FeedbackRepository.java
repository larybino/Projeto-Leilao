package com.github.larybino.leilao.repository;

import com.github.larybino.leilao.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    boolean existsByAuctionIdAndAuthorId(Long auctionId, Long authorId);

    Page<Feedback> findByRecipientId(Long recipientId, Pageable pageable);
}