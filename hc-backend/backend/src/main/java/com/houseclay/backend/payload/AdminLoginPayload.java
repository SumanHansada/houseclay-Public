package com.houseclay.backend.payload;

import lombok.Data;

@Data
public class AdminLoginPayload {
    private String username;
    private String password;
}
