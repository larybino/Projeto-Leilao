package com.github.larybino.leilao.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.larybino.leilao.model.Bid;
import com.github.larybino.leilao.service.BidService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/bid")
public class BidController {
    @Autowired
    private BidService bidService;
 
    @GetMapping
    public ResponseEntity<Page<Bid>> findAll(Pageable pageable) {
        return ResponseEntity.ok(bidService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bid> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bidService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Bid> create(@Valid @RequestBody Bid bid) {
        return ResponseEntity.ok(bidService.create(bid));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bid> update(@PathVariable("id") Long id, @Valid @RequestBody Bid bid) {
        bid.setId(id);
        return ResponseEntity.ok(bidService.update(bid));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        bidService.delete(id);
        return ResponseEntity.ok("Bid with ID " + id + " deleted successfully.");

    }

}
