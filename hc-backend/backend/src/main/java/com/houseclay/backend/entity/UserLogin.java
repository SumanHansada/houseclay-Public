package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class UserLogin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long loginID;

    private String token;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    private User user;

    private Timestamp createdAt;

    private Timestamp expiresAt;

    public UserLogin(String token, User user, long sessionDurationMs) {
        this.token = token;
        this.user = user;
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.expiresAt = new Timestamp(System.currentTimeMillis() + sessionDurationMs);
    }

    public UserLogin() {

    }

    public boolean isExpired() {
        return expiresAt == null || expiresAt.before(new Timestamp(System.currentTimeMillis()));
    }
}
