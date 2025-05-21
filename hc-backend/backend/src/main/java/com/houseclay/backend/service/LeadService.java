package com.houseclay.backend.service;

import com.houseclay.backend.entity.Lead;
import com.houseclay.backend.entity.LeadCategory;
import com.houseclay.backend.entity.User;
import com.houseclay.backend.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LeadService {

    @Autowired
    private LeadRepository leadRepository;

    public Lead createLead(LeadCategory leadCategory, User user) throws Exception {
        Lead lead = new Lead();
        lead.setLeadCategory(leadCategory);
        lead.setUser(user);
        return leadRepository.save(lead);
    }
}
