package com.houseclay.backend.dto;

import com.houseclay.backend.entity.Lead;
import com.houseclay.backend.entity.LeadStatus;
import lombok.Data;

@Data
public class LeadDTO {
    private Long leadId;
    private String phoneNo;
    private String email;
    private String name;
    private LeadStatus status;

    public LeadDTO(Lead lead) {
        this.leadId = lead.getId();
        this.phoneNo = lead.getUser().getPhoneNo();
        this.email = lead.getUser().getEmailID();
        this.name = lead.getUser().getName();
        this.status = lead.getStatus();
    }
}
