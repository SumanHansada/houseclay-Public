package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class UserLoginResponseDTO {
    private String name;
    private String emailID;
    private String phoneNo;
    private int connectBal;
    private String avatarUrl;
}
