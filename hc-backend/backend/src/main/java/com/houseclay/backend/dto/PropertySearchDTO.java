package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class PropertySearchDTO {

    private PropertyDTO property;
    private Long viewUserCount;
    private Long shortlistUserCount;
    private Long contactUserCount;
}
