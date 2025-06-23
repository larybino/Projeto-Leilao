package com.github.larybino.leilao.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.larybino.leilao.model.Person;


public interface PersonRepository extends JpaRepository<Person, Long> {
    
}
