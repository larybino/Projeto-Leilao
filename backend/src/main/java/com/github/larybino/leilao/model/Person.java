package com.github.larybino.leilao.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
@Table(name = "person")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "{validation.name.notblank}")
    private String name;
    @Email(message = "{validation.email.valid}")
    @NotBlank(message = "{validation.email.notblank}")
    private String email;
    @NotBlank(message = "{validation.password.notblank}")
    @Size(min=8, message= "{validation.password.size}")
    private String password;
    private String validateCode;
    @Temporal(TemporalType.TIMESTAMP)
    private Date validateCodeExpiration;
    private boolean active;
    @Lob
    private byte[] profilePicture;

}
