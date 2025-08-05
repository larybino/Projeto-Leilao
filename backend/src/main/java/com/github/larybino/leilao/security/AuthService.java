package com.github.larybino.leilao.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.model.dto.PersonRequestDTO;
import com.github.larybino.leilao.repository.PersonRepository;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String auth(PersonRequestDTO person) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(person.getEmail(), person.getPassword()));

        return jwtService.generateToken(authentication.getName());
    }

    public String register(PersonRequestDTO personDto) {
    if (personRepository.findByEmail(personDto.getEmail()).isPresent()) {
        throw new RuntimeException("Email já cadastrado.");
    }

    Person person = new Person();
    person.setEmail(personDto.getEmail());
    person.setPassword(passwordEncoder.encode(personDto.getPassword()));

    personRepository.save(person);
    return jwtService.generateToken(person.getEmail());
}
}
