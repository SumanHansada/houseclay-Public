package com.houseclay.backend.dto;

import com.houseclay.backend.entity.LeadStatus;
import lombok.Data;

import java.util.List;

@Data
public class LeadDetailDTO {
    Long leadId;
    String phoneNo;
    String email;
    String name;
    LeadStatus status;
    List<LeadCommentDTO> comments;
}