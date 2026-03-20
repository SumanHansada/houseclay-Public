package com.houseclay.backend.dto;

import com.houseclay.backend.enums.CorporateBenefitStatus;

import lombok.Data;

@Data
public class UserLoginResponseDTO {
    private String name;
    private String emailID;
    private String phoneNo;
    private int connectBal;
    private String avatarUrl;
    private boolean isCorporateEmailVerified;
    private CorporateBenefitStatus corporateBenefitStatus;
}
