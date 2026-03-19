package com.houseclay.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class AdminPropertyDetailDTO extends PropertyDetailDTO {
    private List<PropertyUpdateDTO> propertyUpdates;
    private List<UserDTO> viewUsers;
    private List<UserDTO> shortlistUsers;
    private List<ReportUserDTO> reportUsers;
}
