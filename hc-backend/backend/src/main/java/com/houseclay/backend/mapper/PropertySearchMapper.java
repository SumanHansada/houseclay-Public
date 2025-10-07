package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.PropertySearchDTO;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.UserActionType;

public class PropertySearchMapper {

    public static PropertySearchDTO toPropertySearchDTO(Property property) {
        PropertySearchDTO dto = new PropertySearchDTO();
        dto.setProperty(PropertyMapper.toBasicDTO(property));
        dto.setShortlistUserCount(property.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.SHORTLIST)
                .count());
        dto.setContactUserCount(property.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.CONTACT)
                .count());
        dto.setViewUserCount(property.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.VIEW)
                .count());
        return dto;
    }
}
