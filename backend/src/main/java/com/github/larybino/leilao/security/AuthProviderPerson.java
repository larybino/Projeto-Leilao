package com.github.larybino.leilao.security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.repository.PersonRepository;

import java.util.NoSuchElementException;

@Component
public class AuthProviderPerson {

    @Autowired
    private PersonRepository userRepository;

   
    public Person getUserAuth() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;        

        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
            System.out.println(username);
        } else {
            username = principal.toString();
            System.out.println("AAA "+username);
        }

        return userRepository.findByEmail(username)
                .orElseThrow(() -> new NoSuchElementException("User auth not found"));
    }
}