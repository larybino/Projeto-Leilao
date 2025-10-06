package com.github.larybino.leilao.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.larybino.leilao.exception.BusinessException;
import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Category;
import com.github.larybino.leilao.repository.AuctionRepository;
import com.github.larybino.leilao.repository.CategoryRepository;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private AuctionRepository auctionRepository;

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

        long auctionCount = auctionRepository.countByCategoryId(id);
        if (auctionCount > 0) {
            throw new BusinessException("Não é possível excluir a categoria, pois ela está vinculada a " + auctionCount + " leilão(ões).");
        }
        categoryRepository.delete(existingCategory);
    }

    public Page<Category> findAll(String searchTerm, Pageable pageable) {
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            return categoryRepository.findByName(searchTerm, pageable);
        } else {
            return categoryRepository.findAll(pageable);
        }
    }
}