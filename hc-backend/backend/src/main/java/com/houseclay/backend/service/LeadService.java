package com.houseclay.backend.service;

import com.houseclay.backend.dto.LeadDTO;
import com.houseclay.backend.dto.LeadDetailDTO;
import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.mapper.LeadMapper;
import com.houseclay.backend.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;

@Service
public class LeadService {

    @Autowired
    private LeadRepository leadRepository;

    public void createLead(LeadCategory leadCategory, User user) throws Exception {
        Lead lead = new Lead();
        lead.setLeadCategory(leadCategory);
        lead.setStatus(LeadStatus.NEW);
        lead.setUser(user);
        lead.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        leadRepository.save(lead);
    }

    public LeadDetailDTO getLead(Long leadId) throws Exception {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new APIException("Lead not found",HttpStatus.NOT_FOUND));
        return LeadMapper.toLead(lead);
    }

    public void addComment(Long leadId, String comment, Admin admin) throws Exception {
        if (comment.length() > 1000) {
            throw new APIException("Comment exceeds max length of 1000 characters", HttpStatus.BAD_REQUEST);
        }

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new APIException("Lead not found",HttpStatus.NOT_FOUND));

        if (lead.getComments() == null) {
            lead.setComments(new ArrayList<>());
        }
        LeadComment leadComment = new LeadComment();
        leadComment.setLead(lead);
        leadComment.setComment(comment);
        leadComment.setAdmin(admin);
        lead.getComments().add(leadComment);
        leadRepository.save(lead);
    }

    public Page<LeadDTO> getLeads(LeadCategory leadCategory, Pageable pageable) {
        Page<Lead> leads = leadRepository.findByLeadCategory(leadCategory, pageable);
        return leads.map(LeadDTO::new);
    }

    public void updateLeadStatus(Long id, LeadStatus status)  throws APIException {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new APIException("Lead not found", HttpStatus.NOT_FOUND));

        lead.setStatus(status);
        leadRepository.save(lead);
    }
}
