package com.houseclay.backend.dto;

import com.houseclay.backend.entity.AdminRole;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminRegisterDTO {

    @NotBlank(message = "Username cannot be empty")
    private String username;

    @NotBlank(message = "Password cannot be empty")
    private String password;

    @NotBlank(message = "Name cannot be empty")
    private String name;

    private AdminRole role;
}
