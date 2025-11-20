package com.houseclay.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class ReportProperty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long reportId;

    private ReportType reportType;

    private Timestamp reportTime;

    private String comment;

    @ManyToOne
    @JoinColumn(name = "propertyID")
    private Property property;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    private User user;
}
