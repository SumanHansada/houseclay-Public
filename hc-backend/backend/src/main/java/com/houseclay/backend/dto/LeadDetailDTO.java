package com.houseclay.backend.dto;

import com.houseclay.backend.entity.LeadStatus;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class LeadDetailDTO {
    private Long leadId;
    private String phoneNo;
    private String email;
    private String name;
    private LeadStatus status;
    private Timestamp createdAt;
    private List<LeadCommentDTO> comments;
}