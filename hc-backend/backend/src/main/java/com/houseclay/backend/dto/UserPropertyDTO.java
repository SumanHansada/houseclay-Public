package com.houseclay.backend.dto;

import com.houseclay.backend.entity.PropertyCategory;
import com.houseclay.backend.entity.PropertyState;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class UserPropertyDTO {
    private String propertyID;
    private PropertyCategory propertyCategory;
    private String price;
    private String location;
    private String bhkType;
    private PropertyState propertyState;
    private Timestamp createdOn;
    private Timestamp updatedOn;
    private Timestamp availableFrom;
}
