package com.houseclay.backend.mapper;

import com.houseclay.backend.dto.AdminInfoDTO;
import com.houseclay.backend.entity.Admin;

public class AdminMapper {

    public static AdminInfoDTO toAdminInfoDTO(Admin admin) {
        AdminInfoDTO adminInfoDTO = new AdminInfoDTO();
        adminInfoDTO.setName(admin.getName());
        adminInfoDTO.setRole(admin.getRole());
        return adminInfoDTO;
    }
}
