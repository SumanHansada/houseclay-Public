package com.houseclay.backend.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserPayload {

    @NotBlank(message = "PhoneNo cannot be empty")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number")
    private String phoneNo;

    @NotBlank(message = "Name cannot be empty")
    private String name;

    @Email(message = "Invalid email format")
    private String emailID;

    @NotBlank(message = "OTP Code cannot be empty")
    private String otpCode;

    public UserPayload(String phoneNo, String name, String email, String otpCode) {
        this.phoneNo = phoneNo;
        this.name = name;
        this.emailID = email;
        this.otpCode = otpCode;
    }

    public UserPayload() {

    }
}
