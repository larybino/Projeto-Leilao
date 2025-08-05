package com.github.larybino.leilao.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.larybino.leilao.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
