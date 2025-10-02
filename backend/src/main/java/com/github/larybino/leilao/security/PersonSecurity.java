// Pacote: com.github.larybino.leilao.security
package com.github.larybino.leilao.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import com.github.larybino.leilao.repository.PersonRepository;

@Component("personSecurity")
public class PersonSecurity {

    @Autowired
    private PersonRepository personRepository;

    public boolean isSelf(Authentication authentication, Long id) {
        String authenticatedUserEmail = authentication.getName();

        return personRepository.findById(id)
                .map(person -> person.getEmail().equals(authenticatedUserEmail))
                .orElse(false);
    }
}