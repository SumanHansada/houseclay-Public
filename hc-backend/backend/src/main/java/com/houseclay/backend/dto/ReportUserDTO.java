package com.houseclay.backend.dto;

import com.houseclay.backend.entity.ReportType;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class ReportUserDTO {
    private long reportId;
    private ReportType reportType;
    private Timestamp reportTime;
    private UserDTO user;
}
