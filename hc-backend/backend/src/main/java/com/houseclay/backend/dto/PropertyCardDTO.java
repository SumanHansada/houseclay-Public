package com.houseclay.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
public class PropertyCardDTO {
    private String propertyID;
    private String propertyType;
    private Double builtUpArea;
    private String bhkType;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Double rent;
    private String furnishing;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Double price;
    private String city;
    private String locationOrSocietyName;
    private String landmark;
    private double latitude;
    private double longitude;
    private String image;
    private List<String> badges;
}

