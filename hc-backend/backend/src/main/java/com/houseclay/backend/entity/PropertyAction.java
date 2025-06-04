package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Entity
public class PropertyAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private UserActionType userActionType;

    private Timestamp createdAt;

    @ManyToOne
    private Property property;

    @ManyToOne
    private User user;

}
