package com.github.larybino.leilao.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.larybino.leilao.enums.StatusAuction;
import com.github.larybino.leilao.model.Auction;
import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.service.AuctionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auctions")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @GetMapping
    public ResponseEntity<Page<Auction>> findAll(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) StatusAuction status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date endDate,
            Pageable pageable) {
        return ResponseEntity.ok(auctionService.findAll(title, status, categoryId, startDate, endDate, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Auction> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(auctionService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SELLER') or hasAuthority('ADMIN')")
    public ResponseEntity<Auction> create(@Valid @RequestBody Auction auction,
            @AuthenticationPrincipal Person authenticatedUser) {
        return ResponseEntity.ok(auctionService.create(auction, authenticatedUser));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @auctionSecurity.isOwner(authentication, #id)")
    public ResponseEntity<Auction> update(@PathVariable("id") Long id, @Valid @RequestBody Auction auction) {
        auction.setId(id);
        return ResponseEntity.ok(auctionService.update(auction));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @auctionSecurity.isOwner(authentication, #id)")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        auctionService.delete(id);
        return ResponseEntity.ok("Auction with ID " + id + " deleted successfully.");

    }
}
