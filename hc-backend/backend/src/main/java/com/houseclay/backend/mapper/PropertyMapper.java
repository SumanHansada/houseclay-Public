package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.*;
import com.houseclay.backend.entity.*;
import org.aspectj.weaver.patterns.PerObject;

import java.util.List;
import java.util.stream.Collectors;

public class PropertyMapper {

    public static PropertyDTO toDTO(Property property) {
        PropertyDTO dto = PropertyBasicMapper.toBasicDTO(property);
        copyBaseFields(property, dto);
        return dto;
    }

    private static void copyBaseFields(Property source, PropertyDTO target) {
        if (source.getPropertUpdateLogs() != null) {
            List<PropertyUpdateDTO> updates = source.getPropertUpdateLogs().stream().map(updateLog -> {
                PropertyUpdateDTO dto = new PropertyUpdateDTO();
                dto.setUpdateType(updateLog.getUpdateType());
                dto.setUpdateTime(updateLog.getUpdatedAt());

                if (updateLog.getUpdatedByAdmin() != null) {
                    dto.setUpdateBy(updateLog.getUpdatedByAdmin().getUsername());
                    dto.setUserType("ADMIN");
                } else if (updateLog.getUpdatedByUser() != null) {
                    dto.setUpdateBy(updateLog.getUpdatedByUser().getPhoneNo());
                    dto.setUserType("USER");
                } else {
                    dto.setUpdateBy("UNKNOWN");
                    dto.setUserType("UNKNOWN");
                }

                return dto;
            }).toList();

            target.setPropertyUpdates(updates);
        }

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
}
