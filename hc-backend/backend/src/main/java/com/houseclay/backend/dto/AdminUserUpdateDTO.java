package com.houseclay.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserUpdateDTO {
    private String companyName;
    private String jobTitle;
    private String emailID;
}
