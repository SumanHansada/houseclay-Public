package com.houseclay.backend.payload;

import lombok.Data;

@Data
public class UserPayload {

    private String phoneNo;
    private String name;
    private String emailID;
    private String otpCode;
}
