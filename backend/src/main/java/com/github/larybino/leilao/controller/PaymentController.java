package com.github.larybino.leilao.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.larybino.leilao.model.Payment;
import com.github.larybino.leilao.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<Page<Payment>> findAll(Pageable pageable) {
        return ResponseEntity.ok(paymentService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(paymentService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Payment> create(@Valid @RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.create(payment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> update(@PathVariable("id") Long id, @Valid @RequestBody Payment payment) {
        payment.setId(id);
        return ResponseEntity.ok(paymentService.update(payment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        paymentService.delete(id);
        return ResponseEntity.ok("Payment with ID " + id + " deleted successfully.");

    }

}
