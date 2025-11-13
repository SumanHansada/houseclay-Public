package com.houseclay.backend.service;

import com.houseclay.backend.dto.ContactUsDTO;
import com.houseclay.backend.entity.ContactEnquiry;
import com.houseclay.backend.repository.ContactEnquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactUsService {

    @Autowired
    private ContactEnquiryRepository contactEnquiryRepository;

    public ContactEnquiry addContact(ContactUsDTO contactUsDTO) {
        ContactEnquiry contactEnquiry = new ContactEnquiry();
        contactEnquiry.setEmail(contactUsDTO.getEmail());
        contactEnquiry.setName(contactUsDTO.getName());
        contactEnquiry.setMessage(contactUsDTO.getMessage());
        contactEnquiry.setPhone(contactUsDTO.getPhone());
        contactEnquiry.setSubject(contactUsDTO.getSubject());
        return contactEnquiryRepository.save(contactEnquiry);
    }
}
