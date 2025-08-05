package com.github.larybino.leilao.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.larybino.leilao.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
