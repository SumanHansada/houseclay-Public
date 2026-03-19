package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.*;
import com.houseclay.backend.entity.*;

import java.util.stream.Collectors;

public class PropertyDetailMapper {

    public static PropertyDetailDTO toPropertyDetailDTO(Property property) {
        PropertyDetailDTO detailDTO = new PropertyDetailDTO();
        detailDTO.setSecondaryPhoneNumber(property.getSecondaryPhoneNumber());
        detailDTO.setProperty(PropertyMapper.toBasicDTO(property));
        detailDTO.setOwner(UserMapper.toDTO(property.getOwner()));
        detailDTO.setContactUsers(property.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.CONTACT)
                .map(propertyAction -> UserMapper.toContactUserDTO(propertyAction.getUser()))
                .collect(Collectors.toList())
        );
        return detailDTO;
    }

    public static AdminPropertyDetailDTO toAdminPropertyDetailDTO(Property property) {
        AdminPropertyDetailDTO detailDTO = new AdminPropertyDetailDTO();
        detailDTO.setSecondaryPhoneNumber(property.getSecondaryPhoneNumber());
        detailDTO.setProperty(PropertyMapper.toBasicDTO(property));
        detailDTO.setOwner(UserMapper.toDTO(property.getOwner()));
        
        detailDTO.setContactUsers(property.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.CONTACT)
                .map(propertyAction -> UserMapper.toContactUserDTO(propertyAction.getUser()))
                .collect(Collectors.toList())
        );

        detailDTO.setPropertyUpdates(property.getPropertyUpdateLogs().stream()
                .map(PropertyDetailMapper::toPropertyUpdateDTO)
                .collect(Collectors.toList()));

        detailDTO.setViewUsers(property.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.VIEW)
                .map(propertyAction -> UserMapper.toDTO(propertyAction.getUser()))
                .collect(Collectors.toList())
        );

        detailDTO.setShortlistUsers(property.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.SHORTLIST)
                .map(propertyAction -> UserMapper.toDTO(propertyAction.getUser()))
                .collect(Collectors.toList())
        );

        detailDTO.setReportUsers(property.getReportedProperties().stream()
                .map(PropertyDetailMapper::toReportUserDTO)
                .collect(Collectors.toList()));
                
        return detailDTO;
    }

    private static ReportUserDTO toReportUserDTO(ReportProperty reportProperty) {
        ReportUserDTO dto = new ReportUserDTO();
        dto.setReportId(reportProperty.getReportId());
        dto.setReportType(reportProperty.getReportType());
        dto.setReportTime(reportProperty.getReportTime());
        dto.setUser(UserMapper.toDTO(reportProperty.getUser()));
        dto.setComment(reportProperty.getComment());
        return dto;
    }

    private static PropertyUpdateDTO toPropertyUpdateDTO(PropertyUpdateLog propertyUpdateLog) {
        PropertyUpdateDTO dto = new PropertyUpdateDTO();
        dto.setUpdateType(propertyUpdateLog.getUpdateType());
        dto.setUpdateTime(propertyUpdateLog.getUpdatedAt());
        dto.setComment(propertyUpdateLog.getComment());

        if (propertyUpdateLog.getUpdatedByAdmin() != null) {
            dto.setUpdateBy(propertyUpdateLog.getUpdatedByAdmin().getUsername());
            dto.setUserType("ADMIN");
        } else if (propertyUpdateLog.getUpdatedByUser() != null) {
            dto.setUpdateBy(propertyUpdateLog.getUpdatedByUser().getPhoneNo());
            dto.setUserType("USER");
        } else {
            dto.setUpdateBy("UNKNOWN");
            dto.setUserType("UNKNOWN");
        }

        return dto;
    }
}
