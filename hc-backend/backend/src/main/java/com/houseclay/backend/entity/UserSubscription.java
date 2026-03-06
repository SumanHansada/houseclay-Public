package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class UserSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phoneNo", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private SubscriptionSourceType sourceType;

    private String sourceId;

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;

    private Timestamp createdAt;
    
    private Timestamp expiresAt;

    public UserSubscription() {
        this.createdAt = new Timestamp(System.currentTimeMillis());
    }
}
