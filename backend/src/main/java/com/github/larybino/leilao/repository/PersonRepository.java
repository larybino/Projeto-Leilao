package com.github.larybino.leilao.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.github.larybino.leilao.model.Person;

public interface PersonRepository extends JpaRepository<Person, Long> {
    @Query("from Person p where p.email = :email")
    public Page<Person> findByEmail(@Param("email") String email, Pageable pageable);

    public Optional<Person> findByEmail(String email);

    public Optional<Person> findByRecoveryCode(String code);

    public Page<Person> findByNameOrEmail(String name, String email, Pageable pageable);

}
