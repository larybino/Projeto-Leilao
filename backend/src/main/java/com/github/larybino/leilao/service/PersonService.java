package com.github.larybino.leilao.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import com.github.larybino.leilao.exception.NotFoundException;
import com.github.larybino.leilao.model.Person;
import com.github.larybino.leilao.repository.PersonRepository;

@Service
public class PersonService {

    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private MessageSource messageSource;

    public Person create(Person person) {
        return personRepository.save(person);
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

    public List<Person> findAll() {
        return personRepository.findAll();
    }   
}
