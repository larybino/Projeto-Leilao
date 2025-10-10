package com.github.larybino.leilao.controller;

import com.github.larybino.leilao.model.dto.AuctionDetailDTO;
import com.github.larybino.leilao.model.dto.PublicAuctionDTO;
import com.github.larybino.leilao.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auction/public")
public class PublicAuctionController {

    @Autowired
    private AuctionService auctionService;

    @GetMapping
    public ResponseEntity<Page<PublicAuctionDTO>> getPublicAuctions(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "false") boolean showPast,
            @PageableDefault(size = 9) Pageable pageable) {
        
        Page<PublicAuctionDTO> auctionPage = auctionService.findAllPublic(title, categoryId, showPast, pageable);
        return ResponseEntity.ok(auctionPage);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AuctionDetailDTO> getPublicAuctionById(@PathVariable Long id) {
        AuctionDetailDTO auction = auctionService.findPublicById(id);
        return ResponseEntity.ok(auction);
    }
}