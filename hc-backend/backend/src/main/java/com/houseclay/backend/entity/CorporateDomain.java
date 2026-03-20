package com.houseclay.backend.entity;

import com.houseclay.backend.enums.CorporateDomainStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;

@Entity
@Table(name = "corporate_domain")
@Data
public class CorporateDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String domainName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CorporateDomainStatus status;

    private String websiteTitle;

    @Column(nullable = false)
    private Timestamp createdAt;

    @Column(nullable = false)
    private Timestamp updatedAt;

    public CorporateDomain() {}

    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }
}
