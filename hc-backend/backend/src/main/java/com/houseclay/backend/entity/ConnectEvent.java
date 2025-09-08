package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;


@Entity
@Data
public class ConnectEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long connectEventId;

    @ManyToOne
    @JoinColumn(name = "connect_id", nullable = false)
    private Connect connect;

    @Enumerated(EnumType.STRING)
    private ConnectEventType eventType;

    @Enumerated(EnumType.STRING)
    private ActorType actorType;

    private String actorId;

    private Timestamp eventTime;

    @Column(length = 1024)
    private String notes;

    public ConnectEvent() {
        this.eventTime = new Timestamp(System.currentTimeMillis());
    }
}
