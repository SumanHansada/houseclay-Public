package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.*;
import com.houseclay.backend.entity.*;

import java.util.stream.Collectors;

public class PropertyMapper {

    public static PropertyDTO toDTO(Property property) {
        PropertyDTO dto = PropertyBasicMapper.toBasicDTO(property);
        copyAdditionalFields(property, dto);
        return dto;
    }

    private static void copyAdditionalFields(Property source, PropertyDTO target) {
        target.setPropertyUpdates(source.getPropertyUpdateLogs().stream()
                .map(PropertyMapper::toPropertyUpdateDTO)
                .collect(Collectors.toList()));

        target.setOwner(UserMapper.toDTO(source.getOwner()));

        target.setContactUsers(source.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.CONTACT)
                .map(propertyAction -> UserMapper.toDTO(propertyAction.getUser()))
                .collect(Collectors.toList())
        );

        target.setViewUsers(source.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.VIEW)
                .map(propertyAction -> UserMapper.toDTO(propertyAction.getUser()))
                .collect(Collectors.toList())
        );

        target.setShortlistUsers(source.getPropertyActions().stream()
                .filter(propertyAction -> propertyAction.getUserActionType() == UserActionType.SHORTLIST)
                .map(propertyAction -> UserMapper.toDTO(propertyAction.getUser()))
                .collect(Collectors.toList())
        );

        target.setReportUsers(source.getReportedProperties().stream()
                .map(PropertyMapper::toReportUserDTO)
                .collect(Collectors.toList()));

    }

    private static ReportUserDTO toReportUserDTO(ReportProperty reportProperty) {
        ReportUserDTO dto = new ReportUserDTO();
        dto.setReportId(reportProperty.getReportId());
        dto.setReportType(reportProperty.getReportType());
        dto.setReportTime(reportProperty.getReportTime());
        dto.setUser(UserMapper.toDTO(reportProperty.getUser()));
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
