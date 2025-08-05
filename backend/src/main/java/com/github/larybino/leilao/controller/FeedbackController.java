package com.github.larybino.leilao.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.larybino.leilao.model.Feedback;
import com.github.larybino.leilao.service.FeedbackService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping ("/feedbacks")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public ResponseEntity<Page<Feedback>> findAll(Pageable pageable) {
        return ResponseEntity.ok(feedbackService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity <Feedback> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(feedbackService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Feedback> create(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.create(feedback));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feedback> update(@PathVariable("id") Long id, @RequestBody Feedback feedback) {
        feedback.setId(id);
        return ResponseEntity.ok(feedbackService.update(feedback));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        feedbackService.delete(id);
        return ResponseEntity.ok("Feedback with ID " + id + " deleted successfully.");
    }
    

}
