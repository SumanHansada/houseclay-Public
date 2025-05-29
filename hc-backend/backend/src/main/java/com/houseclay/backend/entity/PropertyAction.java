package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@Entity
public class PropertyAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    ActionType actionType;

    private LocalDateTime createdAt;

    @ManyToOne
    Property property;

    @ManyToOne
    User user;

}
