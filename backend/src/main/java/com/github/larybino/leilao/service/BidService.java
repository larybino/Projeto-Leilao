package com.github.larybino.leilao.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Bid;
import com.github.larybino.leilao.repository.BidRepository;

@Service
public class BidService {
    @Autowired
    private BidRepository bidRepository;

    public Bid create(Bid bid) {
        return bidRepository.save(bid);
    }

    public Bid findById(Long id) {
        return bidRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Bid not found with id: " + id));
    }

    public void delete(Long id) {
        Bid existingBid = findById(id);
        bidRepository.delete(existingBid);
    }

    public Bid update(Bid bid) {
        Bid existingBid = findById(bid.getId());
        existingBid.setValue(bid.getValue());
        existingBid.setDateTime(bid.getDateTime());
        return bidRepository.save(existingBid);
    }

    public Page<Bid> findAll(Pageable pageable) {
        return bidRepository.findAll(pageable);
    }
}
