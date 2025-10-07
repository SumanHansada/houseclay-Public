package com.houseclay.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Neighbourhood {

    @Id
    private String id;
    private String name;
    private Double latitude;
    private Double longitude;
    private Long propertyCount;
}
