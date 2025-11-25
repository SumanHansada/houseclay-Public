package com.houseclay.backend.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@DiscriminatorValue("Rent")
@Data
public class RentProperty extends Property {

    private Double rent;
    private Double deposit;
    private Double maintenanceCharges;
    private Boolean rentNegotiable;
    private String preferredTenant;
    private Boolean petsAllowed;
    private Boolean nonVegAllowed;
    private String ownershipType;

}
