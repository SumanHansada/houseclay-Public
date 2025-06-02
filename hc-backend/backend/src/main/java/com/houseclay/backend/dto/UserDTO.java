package com.houseclay.backend.dto;

import lombok.Data;

@Data
public class UserDTO {

    String phoneNo;
    String email;
    String name;
    boolean isBlacklisted;
}
