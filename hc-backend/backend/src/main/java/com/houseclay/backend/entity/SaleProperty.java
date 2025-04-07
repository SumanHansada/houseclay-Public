package com.houseclay.backend.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@DiscriminatorValue("Sale")
@Data
public class SaleProperty extends Property {

    private String ownershipType;
    private Integer propertyAge;
    private Boolean priceNegotiable;
    private Boolean underLoan;
    private Double price;
    private Integer bathrooms;
    private Integer balcony;
    private Boolean khataCertificate;
    private Boolean saleDeed;
    private Boolean propertyTax;

}
