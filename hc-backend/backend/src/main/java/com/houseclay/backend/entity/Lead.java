package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    LeadStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadCategory leadCategory;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    User user;

    @OneToMany(mappedBy = "lead", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LeadComment> comments = new ArrayList<>();

}
