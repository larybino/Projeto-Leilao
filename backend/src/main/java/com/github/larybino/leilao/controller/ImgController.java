package com.github.larybino.leilao.controller;

import com.github.larybino.leilao.model.Img;
import com.github.larybino.leilao.service.ImgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("auctions/{auctionId}/images")
public class ImgController {
    
    @Autowired
    private ImgService imgService;

    @PostMapping
    public ResponseEntity<Img> uploadImage(@PathVariable Long auctionId, @RequestParam("file") MultipartFile file) {
        Img savedImg = imgService.uploadImage(auctionId, file);
        return ResponseEntity.ok(savedImg);
    }

    @GetMapping
    public ResponseEntity<List<Img>> getAuctionImages(@PathVariable Long auctionId) {
        List<Img> images = imgService.getImagesByAuctionId(auctionId);
        return ResponseEntity.ok(images);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long auctionId, @PathVariable Long imageId) {
        imgService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}