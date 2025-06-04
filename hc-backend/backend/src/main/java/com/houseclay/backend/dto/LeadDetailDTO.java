package com.houseclay.backend.dto;

import com.houseclay.backend.entity.LeadStatus;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class LeadDetailDTO {
    Long leadId;
    String phoneNo;
    String email;
    String name;
    LeadStatus status;
    Timestamp createdAt;
    List<LeadCommentDTO> comments;
}