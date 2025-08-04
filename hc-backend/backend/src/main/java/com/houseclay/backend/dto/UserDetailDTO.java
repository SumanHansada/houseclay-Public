package com.houseclay.backend.dto;

import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class UserDetailDTO {
    private String phoneNo;
    private String email;
    private String name;
    private Timestamp createdAt;
    private boolean isBlacklisted;
    private boolean isBroker;
    private Timestamp blacklistedAt;
    private List<UserUpdateDTO> userUpdates;
    private List<UserPropertyDTO> ownedProperties;
    private List<UserPropertyDTO> shortlistedProperties;
    private List<UserPropertyDTO> viewedProperties;
    private List<UserPropertyDTO> contactedProperties;
    private List<ExternalPaymentDTO> externalPayments;
    private List<ConnectDTO> connectTransactions;
    private List<ReportPropertyDTO> reportProperties;
}

