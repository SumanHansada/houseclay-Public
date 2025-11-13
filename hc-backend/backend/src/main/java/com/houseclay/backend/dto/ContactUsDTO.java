package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class ContactUsDTO {

    private String name;
    private String email;
    private String phone;
    private String subject;
    private String message;
}
