package com.houseclay.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class PropertyDetailDTO {
    private PropertyDTO property;
    private String secondaryPhoneNumber;
    private UserDTO owner;
    private List<ContactUserDTO> contactUsers;
}
