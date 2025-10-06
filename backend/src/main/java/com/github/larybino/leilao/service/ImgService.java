package com.github.larybino.leilao.service;

import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Auction;
import com.github.larybino.leilao.model.Img;
import com.github.larybino.leilao.repository.AuctionRepository;
import com.github.larybino.leilao.repository.ImgRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@Service
public class ImgService {
    @Autowired
    private ImgRepository imgRepository;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private AuctionRepository auctionRepository;

    public Img uploadImage(Long auctionId, MultipartFile file) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new NotFoundException("Leilão não encontrado com id: " + auctionId));

        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();

        Img img = new Img(fileName, file.getOriginalFilename(), file.getContentType(), fileDownloadUri, auction);
        return imgRepository.save(img);
    }

    public List<Img> getImagesByAuctionId(Long auctionId) {
        return imgRepository.findByAuctionId(auctionId);
    }

    public void deleteImage(Long imageId) {
        Img img = imgRepository.findById(imageId)
                .orElseThrow(() -> new NotFoundException("Imagem não encontrada com id: " + imageId));

        fileStorageService.deleteFile(img.getFileName());
        imgRepository.delete(img);
    }
}