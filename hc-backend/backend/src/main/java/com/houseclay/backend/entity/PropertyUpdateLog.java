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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActorType actorType;

    @ManyToOne
    private Property property;

    @ManyToOne
    private Admin updatedByAdmin;

    @ManyToOne
    private User updatedByUser;

    public PropertyUpdateLog() {
    }

    public static PropertyUpdateLog forAdmin(Property property, Admin admin, String comment, PropertyUpdateType updateType) {
        PropertyUpdateLog log = base(property, comment, updateType);
        log.actorType = ActorType.ADMIN;
        log.updatedByAdmin = admin;
        return log;
    }

    public static PropertyUpdateLog forUser(Property property, User user, String comment, PropertyUpdateType updateType) {
        PropertyUpdateLog log = base(property, comment, updateType);
        log.actorType = ActorType.USER;
        log.updatedByUser = user;
        return log;
    }

    public static PropertyUpdateLog forSystem(Property property, String comment, PropertyUpdateType updateType) {
        PropertyUpdateLog log = base(property, comment, updateType);
        log.actorType = ActorType.SYSTEM;
        return log;
    }

    private static PropertyUpdateLog base(Property property, String comment, PropertyUpdateType updateType) {
        PropertyUpdateLog log = new PropertyUpdateLog();
        log.property = property;
        log.comment = comment;
        log.updateType = updateType;
        log.updatedAt = new Timestamp(System.currentTimeMillis());
        return log;
    }
}
