package com.houseclay.backend.dto;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class AdminUserDTO {

    private String phoneNo;
    private String email;
    private String name;
    private boolean isBlacklisted;
    private boolean isCorporateEmailVerified;
    private Timestamp createdAt;
}
