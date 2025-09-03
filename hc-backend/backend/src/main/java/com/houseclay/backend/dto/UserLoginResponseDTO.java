package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class UserLoginResponseDTO {
    private String name;
    private String email;
    private int connectBal;
    private String avatarUrl;
    private String token;


}
