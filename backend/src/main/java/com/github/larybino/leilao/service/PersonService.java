package com.github.larybino.leilao.service;


import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;

import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.model.dto.PersonDTO;
import com.github.larybino.leilao.repository.PersonRepository;

@Service
public class PersonService implements UserDetailsService{

    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    private EmailService emailService;
    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    public Person create(PersonDTO personDTO) {
        Person person = new Person();
        person.setName(personDTO.getName());
        person.setEmail(personDTO.getEmail());
        person.setPassword(passwordEncoder.encode(personDTO.getPassword()));
        Person registerPerson = personRepository.save(person);
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

    private void sendEmailRecover(Person person, String recoveryCode) {
        Context context = new Context(LocaleContextHolder.getLocale());
        context.setVariable("name", person.getName());
        context.setVariable("recoveryCode", recoveryCode);
        emailService.sendEmailWithTemplate(
            person.getEmail(),
            "Recuperação de Senha",
            context,
            "recoverPassword"
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

    public void recoverPassword(String email) {
        Person person = personRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("E-mail não encontrado"));

        person.setRecoveryCode(UUID.randomUUID().toString());
        person.setRecoveryCodeExpiration(LocalDateTime.now().plusHours(1));
        personRepository.save(person);
        sendEmailRecover(person, person.getRecoveryCode());
    }

    public void resetPassword(String code, String newPassword) {
        Person person = personRepository.findByRecoveryCode(code)
                .orElseThrow(() -> new NotFoundException("Código inválido"));

        if (person.getRecoveryCodeExpiration().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Código expirado");
        }

        person.setPassword(passwordEncoder.encode(newPassword));
        person.setRecoveryCode(null);
        person.setRecoveryCodeExpiration(null);

        personRepository.save(person);
    }

    @Transactional
    public void changePassword(String email, String oldPassword, String newPassword) {
        Person person = personRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));

        if (!passwordEncoder.matches(oldPassword, person.getPassword())) {
            throw new IllegalArgumentException("A senha antiga está incorreta.");
        }

        person.setPassword(passwordEncoder.encode(newPassword));
        personRepository.save(person);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return personRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }  
}
