package com.houseclay.backend.dto;

import com.houseclay.backend.entity.Lead;
import com.houseclay.backend.entity.LeadStatus;
import lombok.Data;

@Data
public class LeadDTO {
    Long leadId;
    String phone;
    String email;
    String name;
    LeadStatus status;

    public LeadDTO(Lead lead) {
        this.leadId = lead.getId();
        this.phone = lead.getUser().getPhoneNo();
        this.email = lead.getUser().getEmailID();
        this.name = lead.getUser().getName();
        this.status = lead.getStatus();
    }
}
