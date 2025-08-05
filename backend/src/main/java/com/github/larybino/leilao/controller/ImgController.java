package com.github.larybino.leilao.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.larybino.leilao.model.Img;
import com.github.larybino.leilao.service.ImgService;

@RestController
@RequestMapping("/imgs")
public class ImgController {
    @Autowired
    private ImgService imgService;


    @GetMapping
    public ResponseEntity<Page<Img>> findAll(Pageable pageable) {
        return ResponseEntity.ok(imgService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Img> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(imgService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Img> create(@RequestBody Img img) {
        return ResponseEntity.ok(imgService.create(img));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Img> update(@PathVariable("id") Long id, @RequestBody Img img) {
        img.setId(id);
        return ResponseEntity.ok(imgService.update(img));
    }

    @DeleteMapping ("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        imgService.delete(id);
        return ResponseEntity.ok("Image with ID " + id + " deleted successfully.");
    }
}
