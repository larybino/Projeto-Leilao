package com.github.larybino.leilao.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Category;
import com.github.larybino.leilao.repository.CategoryRepository;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public Category create(Category category) {
        return categoryRepository.save(category);
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + id));
    }

    public Category update(Category category) {
        Category existingCategory = findById(category.getId());
        existingCategory.setName(category.getName());
        existingCategory.setObs(category.getObs());
        return categoryRepository.save(existingCategory);
    }

    public void delete(Long id) {
        Category existingCategory = findById(id);
        categoryRepository.delete(existingCategory);
    }

    public Page<Category> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }
}