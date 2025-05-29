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
    String reportId;

    ReportType reportType;

    Timestamp reportTime;

    @ManyToOne
    @JoinColumn(name = "propertyID")
    Property property;

    @ManyToOne
    @JoinColumn(name = "phoneNo")
    User user;
}
