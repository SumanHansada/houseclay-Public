package com.houseclay.backend.payload;

import lombok.Data;

@Data
public class AdminLogoutPayload {
    private String username;
    private String token;
}
