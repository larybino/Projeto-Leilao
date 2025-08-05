package com.github.larybino.leilao.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Feedback;
import com.github.larybino.leilao.repository.FeedbackRepository;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback create(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public Feedback findById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Feedback not found with id: " + id));
    }

    public Feedback update(Feedback feedback) {
        Feedback existingFeedback = findById(feedback.getId());
        existingFeedback.setComment(feedback.getComment());
        existingFeedback.setRating(feedback.getRating());
        return feedbackRepository.save(existingFeedback);
    }

    public void delete(Long id) {
        Feedback existingFeedback = findById(id);
        feedbackRepository.delete(existingFeedback);
    }


    public Page<Feedback> findAll(Pageable pageable) {
        return feedbackRepository.findAll(pageable);
    }
}
