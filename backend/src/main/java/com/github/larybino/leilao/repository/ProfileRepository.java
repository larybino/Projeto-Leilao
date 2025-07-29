package com.github.larybino.leilao.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.larybino.leilao.model.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    
}
