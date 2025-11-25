package com.github.larybino.leilao.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.github.larybino.leilao.enums.StatusAuction;
import com.github.larybino.leilao.exception.BusinessException;
import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Auction;
import com.github.larybino.leilao.model.Bid;
import com.github.larybino.leilao.model.Feedback;
import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.model.dto.AuctionDetailDTO;
import com.github.larybino.leilao.model.dto.PublicAuctionDTO;
import com.github.larybino.leilao.repository.AuctionRepository;
import com.github.larybino.leilao.repository.BidRepository;
import com.github.larybino.leilao.repository.FeedbackRepository;
import com.github.larybino.leilao.utils.AuctionSpecification;

import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;

@Service
public class AuctionService {
    private static final Logger log = LoggerFactory.getLogger(AuctionService.class);
    @Autowired
    private AuctionRepository auctionRepository;
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private BidRepository bidRepository;

    public Auction create(Auction auction, Person seller) {
        Date agora = new Date();
        if (auction.getStartDate() == null || auction.getStartDate().before(agora)) {
            throw new BusinessException("A data de início não pode ser no passado."); 
        }
        if (auction.getEndDate() == null || auction.getEndDate().before(auction.getStartDate())) {
            throw new BusinessException("A data de término deve ser após a data de início.");
        }
        auction.setSeller(seller);
        return auctionRepository.save(auction);
    }

    public Auction findById(Long id) {
        return auctionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Auction not found with id: " + id));
    }

    public Auction update(Auction auction) {
        Auction existingAuction = findById(auction.getId());
        if (existingAuction != null) {
            existingAuction.setTitle(auction.getTitle());
            existingAuction.setDescription(auction.getDescription());
            existingAuction.setStartDate(auction.getStartDate());
            existingAuction.setEndDate(auction.getEndDate());
            existingAuction.setStatus(auction.getStatus());
            existingAuction.setCategory(auction.getCategory());
            existingAuction.setMinBid(auction.getMinBid());
            existingAuction.setIncrementValue(auction.getIncrementValue());
            return auctionRepository.save(existingAuction);
        }
        throw new NotFoundException("Auction not found with id: " + auction.getId());
    }

    public void delete(Long id) {
        Auction existingAuction = findById(id);
        auctionRepository.delete(existingAuction);
    }

    public Page<Auction> findAll(String title, StatusAuction status, Long categoryId, Date startDate, Date endDate,
            Pageable pageable) {
        Specification<Auction> spec = AuctionSpecification.filterBy(title, status, categoryId, startDate, endDate);
        return auctionRepository.findAll(spec, pageable);
    }

    public Page<PublicAuctionDTO> findAllPublic(String title, Long categoryId, boolean showPast, Pageable pageable) {
        Sort sort = pageable.getSort();
        if (sort.isUnsorted()) {
            sort = Sort.by(Sort.Direction.ASC, "endDate");
        }
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                sort);
        Specification<Auction> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (title != null && !title.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (!showPast) {
                predicates.add(root.get("status").in(StatusAuction.OPEN, StatusAuction.IN_PROGRESS));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        Page<Auction> auctionPage = auctionRepository.findAll(spec, pageable);
        return auctionPage.map(this::convertToPublicDTO);
    }

    private PublicAuctionDTO convertToPublicDTO(Auction auction) {
        PublicAuctionDTO dto = new PublicAuctionDTO();
        dto.setId(auction.getId());
        dto.setTitle(auction.getTitle());
        dto.setEndDate(auction.getEndDate());
        dto.setCurrentPrice(auction.getMinBid());
        if (auction.getCategory() != null) {
            dto.setCategoryName(auction.getCategory().getName());
        }
        if (auction.getImages() != null && !auction.getImages().isEmpty()) {
            dto.setCoverImageUrl(auction.getImages().get(0).getUrl());
        }
        dto.setEmailUserBid(auction.getEmailUserBid());
        return dto;
    }

    public AuctionDetailDTO findPublicById(Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Leilão não encontrado com id: " + id));

        return convertToDetailDTO(auction);
    }

    private AuctionDetailDTO convertToDetailDTO(Auction auction) {
        AuctionDetailDTO dto = new AuctionDetailDTO();
        dto.setId(auction.getId());
        dto.setTitle(auction.getTitle());
        dto.setDescription(auction.getDescription());
        dto.setDetailsDescription(auction.getDetailsDescription());
        dto.setStatus(auction.getStatus());
        dto.setStartDate(auction.getStartDate());
        dto.setEndDate(auction.getEndDate());
        dto.setMinBid(auction.getMinBid());
        dto.setIncrementValue(auction.getIncrementValue());
        dto.setImages(auction.getImages());

        if (auction.getCategory() != null) {
            dto.setCategoryName(auction.getCategory().getName());
        }

        Float highestBid = bidRepository.findHighestBidAmount(auction.getId())
                .orElse(auction.getMinBid()); 
        dto.setCurrentPrice(highestBid);
        dto.setEmailUserBid(auction.getEmailUserBid());
        if (auction.getSeller() != null) {
            AuctionDetailDTO.SellerInfoDTO sellerDTO = new AuctionDetailDTO.SellerInfoDTO();
            sellerDTO.setId(auction.getSeller().getId());
            sellerDTO.setName(auction.getSeller().getName());

            Page<Feedback> feedbackPage = feedbackRepository.findByRecipientId(
                    auction.getSeller().getId(),
                    Pageable.unpaged());
            List<Feedback> feedbacks = feedbackPage.getContent();

            sellerDTO.setFeedbackCount(feedbacks.size());

            double average = feedbacks.stream()
                    .mapToInt(Feedback::getRating)
                    .average()
                    .orElse(0.0);
            sellerDTO.setAverageRating(average);

            dto.setSeller(sellerDTO);
        }

        return dto;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void updateAuctionStatuses() {
        log.info("Executando verificação de status de leilões...");
        Date now = new Date();

        List<Auction> auctionsToStart = auctionRepository.findByStatusAndStartDateBefore(StatusAuction.OPEN, now);
        for (Auction auction : auctionsToStart) {
            log.info("Iniciando leilão ID: {}", auction.getId());
            auction.setStatus(StatusAuction.IN_PROGRESS);
            auctionRepository.save(auction);
        }

        List<Auction> auctionsToClose = auctionRepository.findByStatusAndEndDateBefore(StatusAuction.IN_PROGRESS, now);
        for (Auction auction : auctionsToClose) {
            log.info("Encerrando leilão ID: {}", auction.getId());
            auction.setStatus(StatusAuction.CLOSED);
            
            Optional<Bid> topBid = bidRepository.findTopByAuctionIdOrderByAmountDesc(auction.getId());
            if (topBid.isPresent()) {
                auction.setWinner(topBid.get().getPerson());
            }
            
            auctionRepository.save(auction);
        }
    }
}
