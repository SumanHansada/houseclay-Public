package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class AdminLogin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "username")
    private Admin admin;

    @Column(nullable = false, unique = true)
    private String authToken;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public AdminLogin() {}

    public AdminLogin(Admin admin, String authToken) {
        this.admin = admin;
        this.authToken = authToken;
        this.createdAt = LocalDateTime.now();
    }
}

