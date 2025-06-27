package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class UserUpdateLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UserUpdateType userUpdateType;

    private Timestamp updatedAt;

    private String comment;

    @ManyToOne
    private User user;

    @ManyToOne
    private Admin admin;

    public UserUpdateLog(User user, Admin updatedByAdmin, Timestamp updatedAt, UserUpdateType userUpdateType, String comment) {
        this.user = user;
        this.admin = updatedByAdmin;
        this.updatedAt = updatedAt;
        this.userUpdateType = userUpdateType;
        this.comment = comment;
    }

    public UserUpdateLog() {

    }
}
