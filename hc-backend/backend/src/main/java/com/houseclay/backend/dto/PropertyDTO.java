package com.houseclay.backend.dto;

import com.houseclay.backend.entity.PropertyState;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class PropertyDTO {
    private String propertyID;
    private String title;
    private boolean isVerified;
    private boolean isManaged;
    private boolean isPremium;
    private Timestamp postedOn;
    private Double builtUpArea;
    private String facing;
    private String bhkType;
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
    private Boolean parking;
    private Timestamp availableFrom;
    private PropertyState propertyState;
    private List<String> images;
    private List<String> amenities;
    private List<String> preferredTenants;
    private String propertyCategory; // to identify subtype like "Sale", "Rent", "Flatmate"
}
