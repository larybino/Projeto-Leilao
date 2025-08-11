package com.github.larybino.leilao.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.larybino.leilao.model.dto.PersonRequestDTO;
import com.github.larybino.leilao.model.dto.PersonResponseDTO;
import com.github.larybino.leilao.security.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<PersonResponseDTO> login(@RequestBody PersonRequestDTO person) {
        return ResponseEntity.ok(authService.auth(person));
    }
}
