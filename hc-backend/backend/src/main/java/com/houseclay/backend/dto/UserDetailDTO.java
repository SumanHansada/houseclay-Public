package com.houseclay.backend.dto;

import com.houseclay.backend.entity.Property;
import com.houseclay.backend.entity.ReportProperty;
import com.houseclay.backend.entity.ReportType;
import com.houseclay.backend.entity.User;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class UserDetailDTO {
    String phoneNo;
    String email;
    String name;
    Timestamp createdAt;
    boolean isBlacklisted;
    Timestamp blacklistedAt;
    String blacklistedBy;
    List<UserPropertyDTO> ownedProperties;
    List<UserPropertyDTO> shortlistedProperties;
    List<UserPropertyDTO> viewedProperties;
    List<UserPropertyDTO> contactedProperties;
    List<ExternalPaymentDTO> externalPayments;
    List<ConnectTransactionDTO> connectTransactions;
    List<ReportPropertyDTO> reportProperties;
}

