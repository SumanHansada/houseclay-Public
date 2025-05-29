package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

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

    @ElementCollection
    @CollectionTable(name = "lead_comments", joinColumns = @JoinColumn(name = "lead_id"))
    @Column(name = "comment", length = 1000)
    private List<String> comments;

}
