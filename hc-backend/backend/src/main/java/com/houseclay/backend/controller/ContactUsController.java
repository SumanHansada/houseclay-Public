package com.houseclay.backend.controller;

import com.houseclay.backend.dto.ContactUsDTO;
import com.houseclay.backend.service.ContactUsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/contact")
public class ContactUsController {

    @Autowired
    private ContactUsService contactUsService;

    @PostMapping("/add")
    public ResponseEntity<String> addContactEnquiry(@RequestBody ContactUsDTO contact) {
        contactUsService.addContact(contact);
        return ResponseEntity.ok().body("Enquiry add sucessfully");
    }
}
