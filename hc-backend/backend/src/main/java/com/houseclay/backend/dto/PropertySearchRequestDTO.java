package com.houseclay.backend.dto;

import com.houseclay.backend.entity.PropertyCategory;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class PropertySearchRequestDTO {
    @NotNull
    private PropertyCategory propertyCategory;

    @NotNull
    private Double lat;

    @NotNull
    private Double lon;

    private String distance;

    private String city;
    private List<String> bhkType;
    private String furnishing;
    private String propertyType;
    private String parking;
    private Boolean isExclusive;
    private PropertyAvailability propertyAvailability;

    private Double minPrice;
    private Double maxPrice;

    private String preferredTenants;
    private List<String> amenities;

    private String tenantType;
    private Boolean nonVegAllowed;
    private String bathroomType;
    private String balconyType;
    private String roomType;

    private SortFields sortFields;
    private SortOrder sortOrder;
}
