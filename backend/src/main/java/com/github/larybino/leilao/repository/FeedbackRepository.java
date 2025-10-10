package com.github.larybino.leilao.repository;

import com.github.larybino.leilao.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    boolean existsByAuctionIdAndAuthorId(Long auctionId, Long authorId);

    Page<Feedback> findByRecipientId(Long recipientId, Pageable pageable);

    long countByRecipientId(Long recipientId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.recipient.id = :recipientId")
    Double findAverageRatingByRecipientId(@Param("recipientId") Long recipientId);
}