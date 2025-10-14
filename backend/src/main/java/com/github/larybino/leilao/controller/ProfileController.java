package com.github.larybino.leilao.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RestController;

import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.model.Profile;
import com.github.larybino.leilao.model.dto.UserProfileDTO;
import com.github.larybino.leilao.service.ProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/profile")
public class ProfileController {
    @Autowired
    public ProfileService profileService;


    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<Profile>> findAll(Pageable pageable) {
        return ResponseEntity.ok(profileService.findAll(pageable));
    } 

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Profile> create(@Valid @RequestBody Profile profile) {
        return ResponseEntity.ok(profileService.create(profile));
    }

    @PutMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Profile> update(@Valid @RequestBody Profile profile) {
        return ResponseEntity.ok(profileService.update(profile));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        profileService.delete(id);
        return ResponseEntity.ok("Person with ID " + id + " deleted successfully.");
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileDTO> getMyProfile(@AuthenticationPrincipal Person currentUser) {
        UserProfileDTO userProfile = profileService.getCurrentUserProfile(currentUser);
        return ResponseEntity.ok(userProfile);
    }
}
