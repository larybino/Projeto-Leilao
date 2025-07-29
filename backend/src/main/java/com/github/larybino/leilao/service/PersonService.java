package com.github.larybino.leilao.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.repository.PersonRepository;

@Service
public class PersonService implements UserDetailsService{

    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    private EmailService emailService;

    public Person create(Person person) {
        Person registerPerson = personRepository.save(person);
        //emailService.sendEmail(registerPerson.getEmail(), "Cadastro com Sucesso!", "Olá " + registerPerson.getName() + ",\n\nSeu cadastro foi realizado com sucesso no sistema de leilão.\n\nAtenciosamente,\nEquipe de Leilão");
        sendEmailSuccess(registerPerson);
        return registerPerson;
    }

    private void sendEmailSuccess(Person person) {
        Context context = new Context(LocaleContextHolder.getLocale());
        context.setVariable("name", person.getName());
        emailService.sendEmailWithTemplate(
            person.getEmail(),
            "Cadastro realizado com sucesso!",
            context,
            "registerSuccess"
        );
    }
    public Person update(Person person) {
        //return personRepository.save(person);
        Person existingPerson= findById(person.getId());
        existingPerson.setName(person.getName());
        existingPerson.setEmail(person.getEmail());
        return personRepository.save(existingPerson);
    }

    public void delete(Long id) {
        Person existingPerson= findById(id);
        personRepository.delete(existingPerson);
    }

    public Person findById(Long id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage(
                        "person.notfound", 
                        new Object[]{id}, 
                        LocaleContextHolder.getLocale())));
    }

    public Page<Person> findAll(Pageable pageable) {
        return personRepository.findAll(pageable);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return personRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }   
}
