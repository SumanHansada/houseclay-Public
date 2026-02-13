package com.houseclay.backend.dto;

import com.houseclay.backend.entity.AdminRole;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class AdminDetailDTO {
    private String username;
    private String name;
    private String phoneNo;
    private String secondaryPhoneNo;
    private String personalEmail;
    private String address;
    private Timestamp dateOfJoining;
    private Timestamp dateOfBirth;
    private boolean active;
    private AdminRole role;
}
