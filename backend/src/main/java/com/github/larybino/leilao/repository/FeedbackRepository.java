package com.github.larybino.leilao.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.larybino.leilao.model.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}
