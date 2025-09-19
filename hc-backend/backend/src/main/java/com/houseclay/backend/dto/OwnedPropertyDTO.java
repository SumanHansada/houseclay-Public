package com.houseclay.backend.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class OwnedPropertyDTO {
    private String propertyID;
    private String propertyType;
    private String bhkType;
    private Double price;
    private String locationOrSocietyName;
    private String propertyState;
    private Timestamp createdOn;
    private Timestamp updatedOn;
    private Timestamp availableFrom;
}