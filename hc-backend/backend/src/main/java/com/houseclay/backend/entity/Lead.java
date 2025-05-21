package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadCategory leadCategory;

    @OneToOne
    User user;
}
