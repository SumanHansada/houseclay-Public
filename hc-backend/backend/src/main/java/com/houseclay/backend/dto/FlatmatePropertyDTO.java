package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class FlatmatePropertyDTO extends PropertyDTO {
    private Double rent;
    private Double maintenanceCharges;
    private Double depositCharges;
    private String tenantType;
    private Boolean smokingPreference;
    private Boolean drinkingPreference;
    private Boolean nonVegAllowed;
    private String roomType;
    private String bathroomType;
    private String balconyType;
}
