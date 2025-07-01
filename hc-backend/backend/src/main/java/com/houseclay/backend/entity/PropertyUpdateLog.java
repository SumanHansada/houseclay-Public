package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Entity
public class PropertyUpdateLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private PropertyUpdateType updateType;

    private Timestamp updatedAt;

    private String comment;

    @ManyToOne
    private Property property;

    @ManyToOne
    private Admin updatedByAdmin;

    @ManyToOne
    private User updatedByUser;

    public PropertyUpdateLog(Property property, Object updatedBy, String comment, PropertyUpdateType updateType) {
        this.property = property;
        this.updateType = updateType;
        this.updatedAt = new Timestamp(System.currentTimeMillis());
        this.comment = comment;
        if (updatedBy instanceof Admin admin) {
            this.setUpdatedByAdmin(admin);
        } else if (updatedBy instanceof User user) {
            this.setUpdatedByUser(user);
        }
    }

    public PropertyUpdateLog() {
        
    }
}
