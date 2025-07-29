package com.github.larybino.leilao.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Profile;
import com.github.larybino.leilao.repository.ProfileRepository;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;


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
}
