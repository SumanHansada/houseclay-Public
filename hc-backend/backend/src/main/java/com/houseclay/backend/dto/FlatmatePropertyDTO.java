package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class FlatmatePropertyDTO extends PropertyDTO {
    private Double rent;
    private Double maintenanceCharges;
    private Double depositCharges;
    private String tenantType;
    private Boolean attachedBathroom;
    private Boolean attachedBalcony;
    private String smokingPreference;
    private String drinkingPreference;
}
