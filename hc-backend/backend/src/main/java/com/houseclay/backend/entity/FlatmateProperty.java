package com.houseclay.backend.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@DiscriminatorValue("Flatmate")
@Data
public class FlatmateProperty extends Property {
    private Double rent;
    private Double maintenanceCharges;
    private Double depositCharges;
    private String tenantType;
    private Boolean attachedBathroom;
    private Boolean attachedBalcony;
    private String smokingPreference;
    private String drinkingPreference;
    private boolean nonVegAllowed;
    private String roomType;
}
