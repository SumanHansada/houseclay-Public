package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class UserDTO {

    private String phoneNo;
    private String email;
    private String name;
    private boolean isBlacklisted;
}
