package com.houseclay.backend.dto;


import com.houseclay.backend.entity.ReportType;
import lombok.Data;

@Data
public class UserReportDTO {

    private ReportType reportType;
    private String comment;
}
