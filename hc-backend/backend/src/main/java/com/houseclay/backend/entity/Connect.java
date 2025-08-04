package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Connect {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long connectId;

    @ManyToOne
    @JoinColumn(name = "phoneNo", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "propertyID")
    private Property property;

    @Enumerated(EnumType.STRING)
    private ConnectSourceType sourceType;

    private String sourceId;

    @Enumerated(EnumType.STRING)
    private ConnectStatus status;

    @OneToMany(mappedBy = "connect", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConnectEvent> events = new ArrayList<>();

}
