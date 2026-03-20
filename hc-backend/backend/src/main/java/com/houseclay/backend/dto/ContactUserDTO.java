package com.houseclay.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.houseclay.backend.enums.CorporateBenefitStatus;

@Data
@EqualsAndHashCode(callSuper = true)
public class ContactUserDTO extends UserDTO {
    private String companyName;
    private String jobTitle;
    private CorporateBenefitStatus corporateBenefitStatus;
}
