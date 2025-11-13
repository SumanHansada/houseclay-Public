package com.houseclay.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class ContactEnquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contactEnquiryId;

    private String name;
    private String email;
    private String phone;
    private String subject;
    private String message;
}
