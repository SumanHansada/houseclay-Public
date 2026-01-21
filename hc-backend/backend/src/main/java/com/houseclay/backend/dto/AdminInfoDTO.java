package com.houseclay.backend.dto;

import com.houseclay.backend.entity.AdminRole;

import lombok.Data;

@Data
public class AdminInfoDTO {

    private String name;
    private AdminRole role;
}
