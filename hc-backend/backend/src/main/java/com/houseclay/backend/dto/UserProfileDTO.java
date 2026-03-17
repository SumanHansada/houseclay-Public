package com.houseclay.backend.dto;

import lombok.Data;

import java.util.List;

import com.houseclay.backend.enums.CorporateBenefitStatus;

@Data
public class UserProfileDTO {
    private String phoneNo;
    private String email;
    private String name;
    private boolean isEmailVerified;
    private boolean isCorporateEmailVerified;
    private boolean onWhatsApp;
    private int connectBal;
    private String companyName;
    private String jobTitle;
    private CorporateBenefitStatus corporateBenefitStatus;
    private List<OwnedPropertyDTO> ownedProperties;
    private List<PropertyCardDTO> shortlistedProperties;
    private List<PropertyCardDTO> contactedProperties;
    private List<UserExternalPaymentDTO> externalPayments;
}
