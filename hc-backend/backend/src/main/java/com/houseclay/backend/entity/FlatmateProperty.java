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
    private Boolean smokingPreference;
    private Boolean drinkingPreference;
    private boolean nonVegAllowed;
    private String roomType;
    private String bathroomType;
    private String balconyType;
}
