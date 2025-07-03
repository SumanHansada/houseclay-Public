package com.houseclay.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class PropertyCardDTO {
    private String propertyID;
    private String propertyType;
    private Double builtUpArea;
    private String bhkType;
    private Double rent;
    private String furnishing;
    private Double price;
    private String city;
    private String locationOrSocietyName;
    private String landmark;
    private double latitude;
    private double longitude;
    private String image;
    private List<String> badges;
}

