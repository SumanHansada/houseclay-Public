package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.AdminDetailDTO;
import com.houseclay.backend.dto.AdminSummaryDTO;
import com.houseclay.backend.dto.AdminInfoDTO;
import com.houseclay.backend.entity.Admin;

public class AdminMapper {

    public static AdminInfoDTO toAdminInfoDTO(Admin admin) {
        AdminInfoDTO adminInfoDTO = new AdminInfoDTO();
        adminInfoDTO.setName(admin.getName());
        adminInfoDTO.setRole(admin.getRole());
        return adminInfoDTO;
    }

    public static AdminSummaryDTO toAdminSummaryDTO(Admin admin) {
        AdminSummaryDTO dto = new AdminSummaryDTO();
        dto.setName(admin.getName());
        dto.setUsername(admin.getUsername());
        dto.setPhoneNo(admin.getPhoneNo());
        dto.setDateOfJoining(admin.getDateOfJoining());
        dto.setActive(admin.isActive());
        dto.setRole(admin.getRole());
        return dto;
    }

    public static AdminDetailDTO toAdminDetailDTO(Admin admin) {
        AdminDetailDTO dto = new AdminDetailDTO();
        dto.setUsername(admin.getUsername());
        dto.setName(admin.getName());
        dto.setPhoneNo(admin.getPhoneNo());
        dto.setSecondaryPhoneNo(admin.getSecondaryPhoneNo());
        dto.setPersonalEmail(admin.getPersonalEmail());
        dto.setAddress(admin.getAddress());
        dto.setDateOfJoining(admin.getDateOfJoining());
        dto.setDateOfBirth(admin.getDateOfBirth());
        dto.setActive(admin.isActive());
        dto.setRole(admin.getRole());
        return dto;
    }
}
