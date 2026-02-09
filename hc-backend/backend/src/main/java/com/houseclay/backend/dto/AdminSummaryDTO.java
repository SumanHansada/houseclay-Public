package com.houseclay.backend.dto;

import com.houseclay.backend.entity.AdminRole;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class AdminSummaryDTO {
    private String name;
    private String username;
    private String phoneNo;
    private Timestamp dateOfJoining;
    private boolean active;
    private AdminRole role;
}
