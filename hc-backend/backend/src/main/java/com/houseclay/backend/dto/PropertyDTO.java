package com.houseclay.backend.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.houseclay.backend.entity.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "propertyCategory", // this field tells Jackson what subclass to use
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = SalePropertyDTO.class, name = "RESALE"),
        @JsonSubTypes.Type(value = RentPropertyDTO.class, name = "RENT"),
        @JsonSubTypes.Type(value = FlatmatePropertyDTO.class, name = "FLATMATE")
})
@Data
public class PropertyDTO {
    private String propertyID;
    private String title;
    private String propertyType;
    private String coverImage;
    private boolean isManaged;
    private boolean isPremium;
    private Double builtUpArea;
    private String facing;
    private String bhkType;
    private Integer bathrooms;
    private Integer floor;
    private Integer totalFloors;
    private String floorType;
    private String description;
    private String city;
    private String locationOrSocietyName;
    private String landmark;
    private Double latitude;
    private Double longitude;
    private String furnishing;
    private String propertyAge;
    private String waterSupply;
    private String powerBackup;
    private String parking;
    private Timestamp availableFrom;
    private PropertyState propertyState;
    private List<String> images;
    private List<String> amenities;
    private List<String> preferredTenants;
    private PropertyCategory propertyCategory;
}


