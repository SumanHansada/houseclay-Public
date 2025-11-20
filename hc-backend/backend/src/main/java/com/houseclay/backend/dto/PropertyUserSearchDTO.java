package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class PropertyUserSearchDTO {

    PropertySearchDTO property;
    OwnerDetailDTO owner;
    boolean isReported;
    boolean isOwner;
}
