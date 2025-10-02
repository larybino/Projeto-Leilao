package com.github.larybino.leilao.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
import com.github.larybino.leilao.model.PersonProfile;
import com.github.larybino.leilao.model.Profile;
import com.github.larybino.leilao.model.dto.PersonDTO;
import com.github.larybino.leilao.repository.PersonRepository;
import com.github.larybino.leilao.repository.ProfileRepository;

@Service
public class PersonService implements UserDetailsService {

    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private ProfileRepository profileRepository;
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
        if (personDTO.getProfileIds() != null && !personDTO.getProfileIds().isEmpty()) {
            List<Profile> profiles = profileRepository.findAllById(personDTO.getProfileIds());

            List<PersonProfile> personProfiles = profiles.stream().map(profile -> {
                PersonProfile personProfile = new PersonProfile();
                personProfile.setProfile(profile);
                return personProfile;
            }).collect(Collectors.toList());
            person.setPersonProfile(personProfiles);
        }
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
                "registerSuccess");
    }

    private void sendEmailRecover(Person person, String recoveryCode) {
        Context context = new Context(LocaleContextHolder.getLocale());
        context.setVariable("name", person.getName());
        context.setVariable("recoveryCode", recoveryCode);
        emailService.sendEmailWithTemplate(
                person.getEmail(),
                "Recuperação de Senha",
                context,
                "recoverPassword");
    }

    public Person update(Long id, Person person) {
        Person existingPerson = findById(id);
        existingPerson.setName(person.getName());
        existingPerson.setEmail(person.getEmail());
        return personRepository.save(existingPerson);
    }

    public void delete(Long id) {
        Person existingPerson = findById(id);
        personRepository.delete(existingPerson);
    }

    public Person findById(Long id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage(
                        "person.notfound",
                        new Object[] { id },
                        LocaleContextHolder.getLocale())));
    }

    public Page<Person> findAll(String searchTerm, Pageable pageable) {
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            return personRepository.findByNameOrEmail(searchTerm, searchTerm, pageable);
        } else {
            return personRepository.findAll(pageable);
        }
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
