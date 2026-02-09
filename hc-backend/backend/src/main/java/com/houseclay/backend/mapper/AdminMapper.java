package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.AdminDetailDTO;
import com.houseclay.backend.dto.AdminInfoDTO;
import com.houseclay.backend.entity.Admin;

public class AdminMapper {

    public static AdminInfoDTO toAdminInfoDTO(Admin admin) {
        AdminInfoDTO adminInfoDTO = new AdminInfoDTO();
        adminInfoDTO.setName(admin.getName());
        adminInfoDTO.setRole(admin.getRole());
        return adminInfoDTO;
    }

    public static AdminDetailDTO toAdminDetailDTO(Admin admin) {
        AdminDetailDTO dto = new AdminDetailDTO();
        dto.setName(admin.getName());
        dto.setUsername(admin.getUsername());
        dto.setPhoneNo(admin.getPhoneNo());
        dto.setDateOfJoining(admin.getDateOfJoining());
        dto.setActive(admin.isActive());
        dto.setRole(admin.getRole());
        return dto;
    }
}
