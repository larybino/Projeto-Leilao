package com.github.larybino.leilao.model;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

@Entity
@Data
@Table(name = "person")
public class Person implements UserDetails{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "{validation.name.notblank}")
    private String name;
    @Email(message = "{validation.email.valid}")
    @NotBlank(message = "{validation.email.notblank}")
    private String email;
    @JsonIgnore
    private String password;
    private String validateCode;
    @Temporal(TemporalType.TIMESTAMP)
    private Date validateCodeExpiration;
    private boolean active;
    @Lob
    private byte[] profilePicture;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Setter(value= AccessLevel.NONE)
    private List<PersonProfile> personProfile;

    public void setPersonProfile(List<PersonProfile> personProfile) {
        for (PersonProfile pp : personProfile) {
            pp.setPerson(this);
        }
        this.personProfile = personProfile;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return personProfile.stream()
                .map(user -> new SimpleGrantedAuthority(user.getProfile().getType().name())).collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
