package com.houseclay.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class PropertyDetailDTO {
    private PropertyDTO property;
    private String secondaryPhoneNumber;
    List<PropertyUpdateDTO> propertyUpdates;
    private UserDTO owner;
    private List<UserDTO> viewUsers;
    private List<UserDTO> shortlistUsers;
    private List<UserDTO> contactUsers;
    private List<ReportUserDTO> reportUsers;
}
