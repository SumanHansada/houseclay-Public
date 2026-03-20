package com.houseclay.backend.dto;

import lombok.Data;
import java.sql.Timestamp;

import com.houseclay.backend.enums.CorporateBenefitStatus;

@Data
public class AdminUserDTO {

    private String phoneNo;
    private String email;
    private String name;
    private boolean isBlacklisted;
    private boolean isCorporateEmailVerified;
    private CorporateBenefitStatus corporateBenefitStatus;
    private Timestamp createdAt;
}
