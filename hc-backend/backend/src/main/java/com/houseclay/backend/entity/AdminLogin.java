package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

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
    private Timestamp createdAt;

    private Timestamp expiresAt;

    public AdminLogin() {}

    public AdminLogin(Admin admin, String authToken, long sessionDurationMs) {
        this.admin = admin;
        this.authToken = authToken;
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.expiresAt = new Timestamp(System.currentTimeMillis() + sessionDurationMs);
    }

    public boolean isExpired() {
        return expiresAt == null || expiresAt.before(new Timestamp(System.currentTimeMillis()));
    }
}

