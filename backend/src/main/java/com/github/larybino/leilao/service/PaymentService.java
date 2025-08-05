package com.github.larybino.leilao.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Payment;
import com.github.larybino.leilao.repository.PaymentRepository;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public Payment create(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Payment findById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment not found with id: " + id));
    }

    public Payment update(Payment payment) {
        Payment existingPayment = findById(payment.getId());
        existingPayment.setValue(payment.getValue());
        existingPayment.setDateTime(payment.getDateTime());
        existingPayment.setStatus(payment.getStatus());
        return paymentRepository.save(existingPayment);
    }

    public void delete(Long id) {
        Payment existingPayment = findById(id);
        paymentRepository.delete(existingPayment);
    }

    public Page<Payment> findAll(Pageable pageable) {
        return paymentRepository.findAll(pageable);
    }

}
