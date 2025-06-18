package com.houseclay.backend.dto;

import com.houseclay.backend.entity.PropertyCategory;
import com.houseclay.backend.entity.PropertyState;
import lombok.Data;

@Data
public class UserPropertyDTO {
    private String propertyID;
    private String title;
    private PropertyCategory propertyCategory;
    private String price;
    private String location;
    private String bhkType;
    private PropertyState propertyState;
}
