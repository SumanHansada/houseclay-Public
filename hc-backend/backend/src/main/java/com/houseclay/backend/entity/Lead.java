package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;


@Entity
@Data
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LeadStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadCategory leadCategory;

    private Timestamp createdAt;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    private User user;

    @OneToMany(mappedBy = "lead", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LeadComment> comments = new ArrayList<>();

}
