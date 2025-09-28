package com.houseclay.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserProfileDTO {
    private String phoneNo;
    private String email;
    private String name;
    private boolean isEmailVerified;
    private boolean onWhatsApp;
    private int connectBal;
    private List<OwnedPropertyDTO> ownedProperties;
    private List<PropertyCardDTO> shortlistedProperties;
    private List<PropertyCardDTO> contactedProperties;
    private List<UserExternalPaymentDTO> externalPayments;
}
