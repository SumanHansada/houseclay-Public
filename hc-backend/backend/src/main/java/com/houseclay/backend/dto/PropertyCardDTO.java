package com.houseclay.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.houseclay.backend.entity.PropertyCategory;
import com.houseclay.backend.entity.PropertyState;
import lombok.Data;

import java.util.List;

@Data
public class PropertyCardDTO {
    private String propertyID;
    private String propertyType;
    private PropertyState propertyState;
    private PropertyCategory propertyCategory;
    private Double builtUpArea;
    private String bhkType;
    private Integer bathrooms;
    private String furnishing;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Double rent;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Double price;
    private String city;
    private String locationOrSocietyName;
    private String landmark;
    private double latitude;
    private double longitude;
    private List<String> images;
    private String coverImage;
    private List<String> badges;
}

