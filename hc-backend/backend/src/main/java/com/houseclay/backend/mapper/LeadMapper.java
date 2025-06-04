package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.LeadCommentDTO;
import com.houseclay.backend.dto.LeadDetailDTO;
import com.houseclay.backend.entity.Lead;
import com.houseclay.backend.entity.LeadComment;

public class LeadMapper {

    public static LeadDetailDTO toLead(Lead lead) {
        LeadDetailDTO leadDetailDTO = new LeadDetailDTO();
        leadDetailDTO.setLeadId(lead.getId());
        leadDetailDTO.setName(lead.getUser().getName());
        leadDetailDTO.setEmail(lead.getUser().getEmailID());
        leadDetailDTO.setPhoneNo(lead.getUser().getPhoneNo());
        leadDetailDTO.setStatus(lead.getStatus());
        leadDetailDTO.setCreatedAt(lead.getCreatedAt());
        leadDetailDTO.setComments(lead.getComments().stream().map(LeadMapper::toComment).toList());
        return leadDetailDTO;
    }

    public static LeadCommentDTO toComment(LeadComment leadComment) {
        LeadCommentDTO leadCommentDTO = new LeadCommentDTO();
        leadCommentDTO.setDate(leadComment.getCreatedAt());
        leadCommentDTO.setComment(leadComment.getComment());
        leadCommentDTO.setAuthor(leadComment.getAdmin().getName());
        return leadCommentDTO;
    }
}
