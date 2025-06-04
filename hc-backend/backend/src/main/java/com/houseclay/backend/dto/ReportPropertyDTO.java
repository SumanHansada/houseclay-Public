package com.houseclay.backend.dto;

import com.houseclay.backend.entity.ReportType;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class ReportPropertyDTO {
    String reportId;
    ReportType reportType;
    Timestamp reportTime;
    UserPropertyDTO userProperty;
}
