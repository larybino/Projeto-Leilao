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

import com.github.larybino.leilao.model.Profile;
import com.github.larybino.leilao.service.ProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/profile")
public class ProfileController {
    @Autowired
    public ProfileService profileService;


    @GetMapping
    public ResponseEntity<Page<Profile>> findAll(Pageable pageable) {
        return ResponseEntity.ok(profileService.findAll(pageable));
    } 

    @PostMapping
    public ResponseEntity<Profile> create(@Valid @RequestBody Profile profile) {
        return ResponseEntity.ok(profileService.create(profile));
    }

    @PutMapping
    public ResponseEntity<Profile> update(@Valid @RequestBody Profile profile) {
        return ResponseEntity.ok(profileService.update(profile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        profileService.delete(id);
        return ResponseEntity.ok("Person with ID " + id + " deleted successfully.");

    }
}
