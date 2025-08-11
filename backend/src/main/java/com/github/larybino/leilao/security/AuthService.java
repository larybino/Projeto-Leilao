package com.github.larybino.leilao.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.model.dto.PersonRequestDTO;
import com.github.larybino.leilao.model.dto.PersonResponseDTO;
import com.github.larybino.leilao.repository.PersonRepository;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PersonRepository personRepository;


    public PersonResponseDTO auth(PersonRequestDTO person) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(person.getEmail(), person.getPassword()));

        Person persondb = personRepository.findByEmail(person.getEmail()).get();

        PersonResponseDTO response = new PersonResponseDTO();
        response.setEmail(persondb.getEmail());
        response.setName(persondb.getName());
        response.setToken(jwtService.generateToken(authentication.getName()));

        return response;
    }

}
