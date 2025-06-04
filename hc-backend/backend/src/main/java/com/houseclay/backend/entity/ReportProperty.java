package com.houseclay.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class ReportProperty {

    @Id
    private String reportId;

    private ReportType reportType;

    private Timestamp reportTime;

    @ManyToOne
    @JoinColumn(name = "propertyID")
    private Property property;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    private User user;
}
