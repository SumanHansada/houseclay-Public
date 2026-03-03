package com.houseclay.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ContactUserDTO extends UserDTO {
    private String companyName;
    private String jobTitle;
}
