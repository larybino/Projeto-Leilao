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

import com.github.larybino.leilao.model.Auction;
import com.github.larybino.leilao.service.AuctionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auction")
public class AuctionController {
    
    @Autowired
    private AuctionService auctionService;

    
    @GetMapping
    public ResponseEntity<Page<Auction>> findAll(Pageable pageable) {
        return ResponseEntity.ok(auctionService.findAll(pageable));
    } 

    @GetMapping("/{id}")
    public ResponseEntity<Auction> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(auctionService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Auction> create(@Valid @RequestBody Auction auction) {
        return ResponseEntity.ok(auctionService.create(auction));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Auction> update(@PathVariable("id") Long id, @Valid @RequestBody Auction auction) {
        auction.setId(id);
        return ResponseEntity.ok(auctionService.update(auction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        auctionService.delete(id);
        return ResponseEntity.ok("Auction with ID " + id + " deleted successfully.");

    }
}
