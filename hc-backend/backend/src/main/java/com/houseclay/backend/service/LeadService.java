package com.houseclay.backend.service;

import com.houseclay.backend.entity.*;
import com.houseclay.backend.exception.APIException;
import com.houseclay.backend.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class LeadService {

    @Autowired
    private LeadRepository leadRepository;

    public void createLead(LeadCategory leadCategory, User user) throws Exception {
        Lead lead = new Lead();
        lead.setLeadCategory(leadCategory);
        lead.setUser(user);
        leadRepository.save(lead);
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
}
