package com.houseclay.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class PropertyCardDTO {
    private String propertyID;
    private String propertyCategory;
    private String propertyType;
    private double builtUpArea;
    private String bhkType;
    private Integer bathrooms;
    private Integer rent;
    private String furnishing;
    private Integer price;
    private String city;
    private String locationOrSocietyName;
    private String landmark;
    private double latitude;
    private double longitude;
    private List<String> images;
    private String badges;

}

