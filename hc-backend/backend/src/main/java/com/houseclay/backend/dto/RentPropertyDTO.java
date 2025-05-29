package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class RentPropertyDTO extends PropertyDTO {
    private Double rent;
    private Double deposit;
    private Double maintenanceCharges;
    private Boolean rentNegotiable;
    private String preferredTenant;
    private Boolean petsAllowed;
    private Boolean nonVegAllowed;
}
