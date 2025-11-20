package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.PropertySearchDTO;
import com.houseclay.backend.dto.PropertyUserSearchDTO;
import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.User;
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

    public static PropertyUserSearchDTO toPropertyUserSearchDTO(Property property, User user, boolean isReported, boolean isOwner) {
        PropertyUserSearchDTO dto = new PropertyUserSearchDTO();
        dto.setProperty(toPropertySearchDTO(property));
        if (user != null) {
            dto.setOwner(OwnerMapper.toOwnerDetailDTO(user));
        }
        dto.setReported(isReported);
        dto.setOwner(isOwner);
        return dto;
    }
}
