package com.github.larybino.leilao.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Img;
import com.github.larybino.leilao.repository.ImgRepository;

@Service
public class ImgService {
    @Autowired
    private ImgRepository imgRepository;

    public Img create(Img img) {
        return imgRepository.save(img);
    }

    public Img findById(Long id) {
        return imgRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Image not found with id: " + id));
    }

    public Img update(Img img) {
        Img existingImg = findById(img.getId());
        existingImg.setUrl(img.getUrl());
        existingImg.setDateTime(img.getDateTime());
        return imgRepository.save(existingImg);
    }

    public void delete(Long id) {
        Img existingImg = findById(id);
        imgRepository.delete(existingImg);
    }

    public Page<Img> findAll(Pageable pageable) {
        return imgRepository.findAll(pageable);
    }
}
