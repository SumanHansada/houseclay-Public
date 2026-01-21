package com.houseclay.backend.dto;

import java.sql.Timestamp;

import com.houseclay.backend.entity.AdminRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminRegisterDTO {

    @NotBlank(message = "Username cannot be empty")
    @Email(message = "Invalid email format")
    private String username;
    @NotBlank(message = "Password cannot be empty")
    private String password;
    @NotBlank(message = "Name cannot be empty")
    private String name;
    @NotBlank(message = "Phone number cannot be empty")
    private String phoneNo;

    private String secondaryPhoneNo; 

    @NotBlank(message = "Personal email cannot be empty")
    @Email(message = "Invalid email format")
    private String personalEmail;

    @NotBlank(message = "Address cannot be empty")
    private String address;

    @NotNull(message = "Date of joining cannot be null")
    private Timestamp dateOfJoining;

    @NotNull(message = "Date of birth cannot be null")
    private Timestamp dateOfBirth;

    @NotNull(message = "Role cannot be null")
    private AdminRole role;
}
