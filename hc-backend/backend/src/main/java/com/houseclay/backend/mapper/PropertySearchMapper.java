package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.PropertySearchDTO;
import com.houseclay.backend.dto.PropertyUserSearchDTO;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.User;

public class PropertySearchMapper {

    public static PropertySearchDTO toPropertySearchDTO(Property property) {
        PropertySearchDTO dto = new PropertySearchDTO();
        dto.setProperty(PropertyMapper.toBasicDTO(property));
        return dto;
    }

    public static PropertyUserSearchDTO toPropertyUserSearchDTO(Property property, User user, boolean isReported, boolean isOwner) {
        PropertyUserSearchDTO dto = new PropertyUserSearchDTO();
        dto.setProperty(toPropertySearchDTO(property));
        if (user != null) {
            dto.setOwner(OwnerMapper.toOwnerDetailDTO(user, property));
        }
        dto.setReported(isReported);
        dto.setPropertyOwner(isOwner);
        return dto;
    }
}
