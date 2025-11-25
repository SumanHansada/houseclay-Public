package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class SalePropertyDTO extends PropertyDTO {
    private String ownershipType;
    private Boolean priceNegotiable;
    private Boolean underLoan;
    private Double price;
    private Integer bathrooms;
    private String khataCertificate;
    private Boolean saleDeed;
    private Boolean propertyTax;
}
