package com.houseclay.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class OwnedPropertyDTO {
    private String propertyID;
    private String propertyType;
    private String bhkType;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Double rent;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Double price;
    private String locationOrSocietyName;
    private Double builtUpArea;
    private String propertyState;
    private Timestamp createdOn;
    private Timestamp updatedOn;
    private Timestamp availableFrom;
}