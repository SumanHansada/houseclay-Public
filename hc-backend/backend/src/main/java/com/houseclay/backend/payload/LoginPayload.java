package com.houseclay.backend.payload;

import lombok.Data;

@Data
public class LoginPayload {
    private String phoneNo;
    private String otpCode;
}
