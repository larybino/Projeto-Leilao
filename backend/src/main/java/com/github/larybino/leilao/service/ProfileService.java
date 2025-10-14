package com.github.larybino.leilao.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.model.Profile;
import com.github.larybino.leilao.model.dto.UserProfileDTO;
import com.github.larybino.leilao.repository.FeedbackRepository;
import com.github.larybino.leilao.repository.ProfileRepository;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private FeedbackRepository feedbackRepository;

    public Profile create(Profile profile) {
        return profileRepository.save(profile);
    }

    public Profile findById(Long id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Profile not found with id: " + id));
    }   

    public Profile update(Profile profile) {
        Profile existingProfile = findById(profile.getId());
        existingProfile.setType(profile.getType());
        return profileRepository.save(existingProfile);
    }

    public void delete(Long id) {
        Profile existingProfile = findById(id);
        profileRepository.delete(existingProfile);
    }

     public Page<Profile> findAll(Pageable pageable) {
        return profileRepository.findAll(pageable);
    }  
    
    public UserProfileDTO getCurrentUserProfile(Person currentUser) {
        if (currentUser == null) {
            return null;
        }
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(currentUser.getId());
        dto.setName(currentUser.getName());
        dto.setEmail(currentUser.getEmail());
        List<String> roles = currentUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        dto.setRoles(roles);
        long feedbackCount = feedbackRepository.countByRecipientId(currentUser.getId());
        Double averageRating = feedbackRepository.findAverageRatingByRecipientId(currentUser.getId());
        dto.setFeedbackCount((int) feedbackCount);
        dto.setAverageRating(averageRating != null ? averageRating : 0.0);
        return dto;
    }
}
